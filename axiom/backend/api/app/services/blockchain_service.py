import asyncio
import json
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from fastapi import HTTPException, status
from web3 import Web3

from app.core.config import settings


@dataclass(frozen=True)
class MonadReceipt:
    tx_hash: str
    status: int
    block_number: int
    logs: list[Any]


@dataclass(frozen=True)
class SubmittedFixReceipt:
    tx_hash: str
    onchain_fix_id: int


class BlockchainService:
    PUBLISH_GAS = 600_000
    MATCH_GAS = 200_000
    SUBMIT_FIX_GAS = 600_000
    VOTE_GAS = 300_000

    def __init__(self) -> None:
        self.web3 = Web3(Web3.HTTPProvider(settings.monad_rpc_url))
        self._contract = None
        self._account = None

    @property
    def contract(self):
        if self._contract is None:
            self._require_config()
            self._contract = self.web3.eth.contract(
                address=self.web3.to_checksum_address(settings.fingerprint_registry_address),
                abi=self._load_abi("FingerprintRegistry"),
            )
        return self._contract

    @property
    def account(self):
        if self._account is None:
            self._require_config()
            self._account = self.web3.eth.account.from_key(settings.private_key)
        return self._account

    async def publish_fingerprint(self, payload: dict[str, Any]) -> dict[str, Any]:
        receipt = await self._send(
            self.contract.functions.publishFingerprint(
                payload["hash"],
                payload["language"],
                payload["framework"],
                payload["severity"],
                payload.get("error_type", "UnknownError"),
            ),
            self.PUBLISH_GAS,
        )
        return {"tx_hash": receipt.tx_hash, "chain_id": settings.monad_chain_id, "fingerprint": payload["hash"]}

    async def report_match(self, fingerprint_hash: str) -> dict[str, Any]:
        receipt = await self._send(self.contract.functions.reportMatch(fingerprint_hash), self.MATCH_GAS)
        return {"tx_hash": receipt.tx_hash, "chain_id": settings.monad_chain_id, "fingerprint": fingerprint_hash}

    async def submit_fix(
        self,
        fingerprint_hash: str,
        title: str,
        description: str,
        submitter: str,
    ) -> SubmittedFixReceipt:
        title_hash = self.web3.keccak(text=title)
        description_hash = self.web3.keccak(text=description)
        receipt = await self._send(
            self.contract.functions.submitFix(
                fingerprint_hash,
                title_hash,
                description_hash,
                self.web3.to_checksum_address(submitter),
            ),
            self.SUBMIT_FIX_GAS,
        )
        events = self.contract.events.FixSubmitted().process_receipt({"logs": receipt.logs})
        if not events:
            raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY, detail="FixSubmitted event missing")
        return SubmittedFixReceipt(tx_hash=receipt.tx_hash, onchain_fix_id=int(events[0]["args"]["fixId"]))

    async def vote_fix(self, onchain_fix_id: int, voter: str, successful: bool) -> dict[str, Any]:
        receipt = await self._send(
            self.contract.functions.vote(onchain_fix_id, self.web3.to_checksum_address(voter), successful),
            self.VOTE_GAS,
        )
        return {"tx_hash": receipt.tx_hash, "chain_id": settings.monad_chain_id, "onchain_fix_id": onchain_fix_id}

    async def update_reputation(self, payload: dict[str, Any]) -> dict[str, Any]:
        return {"chain_id": settings.monad_chain_id, "wallet_address": payload["wallet_address"]}

    async def _send(self, function: Any, gas: int) -> MonadReceipt:
        return await asyncio.to_thread(self._send_sync, function, gas)

    def _send_sync(self, function: Any, gas: int) -> MonadReceipt:
        self._require_config()
        latest = self.web3.eth.get_block("latest")
        base_fee = int(latest.get("baseFeePerGas") or self.web3.eth.gas_price)
        priority_fee = self.web3.to_wei(settings.monad_priority_fee_gwei, "gwei")
        nonce = self.web3.eth.get_transaction_count(self.account.address)
        tx = function.build_transaction(
            {
                "from": self.account.address,
                "chainId": settings.monad_chain_id,
                "nonce": nonce,
                "gas": gas,
                "maxFeePerGas": base_fee + priority_fee,
                "maxPriorityFeePerGas": priority_fee,
            }
        )
        signed = self.web3.eth.account.sign_transaction(tx, settings.private_key)
        raw_tx = getattr(signed, "rawTransaction", None) or getattr(signed, "raw_transaction")
        tx_hash = self.web3.eth.send_raw_transaction(raw_tx)
        receipt = self.web3.eth.wait_for_transaction_receipt(tx_hash, timeout=120)
        receipt_status = int(receipt.get("status", 0))
        if receipt_status != 1:
            raise HTTPException(
                status_code=status.HTTP_502_BAD_GATEWAY,
                detail={"message": "Monad transaction reverted", "tx_hash": tx_hash.hex()},
            )
        return MonadReceipt(
            tx_hash=tx_hash.hex(),
            status=receipt_status,
            block_number=int(receipt.get("blockNumber", 0)),
            logs=list(receipt.get("logs", [])),
        )

    def _require_config(self) -> None:
        if not settings.private_key or not settings.fingerprint_registry_address:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Monad relayer PRIVATE_KEY and FINGERPRINT_REGISTRY_ADDRESS are required",
            )

    def _load_abi(self, name: str) -> list[dict[str, Any]]:
        candidates = [
            Path(__file__).resolve().parents[4] / "contracts" / "abi" / f"{name}.json",
            Path(__file__).resolve().parents[1] / "abi" / f"{name}.json",
        ]
        for path in candidates:
            if path.exists():
                return json.loads(path.read_text(encoding="utf-8"))["abi"]
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"{name} ABI artifact missing")
