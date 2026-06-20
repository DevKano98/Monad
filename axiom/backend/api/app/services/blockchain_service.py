from typing import Any

from app.core.config import settings
from app.services.websocket_service import WebSocketService


class BlockchainService:
    def __init__(self) -> None:
        self.websocket = WebSocketService()

    async def publish_fingerprint(self, payload: dict[str, Any]) -> dict[str, Any]:
        tx_hash = payload.get("monad_tx_hash") or f"simulated:{payload['hash']}"
        event = {"tx_hash": tx_hash, "chain_id": settings.monad_chain_id, "fingerprint": payload["hash"]}
        await self.websocket.broadcast("blockchain.published", event)
        return event

    async def update_reputation(self, payload: dict[str, Any]) -> dict[str, Any]:
        tx_hash = payload.get("monad_tx_hash") or f"simulated:reputation:{payload['wallet_address']}"
        event = {"tx_hash": tx_hash, "chain_id": settings.monad_chain_id, "wallet_address": payload["wallet_address"]}
        await self.websocket.broadcast("blockchain.published", event)
        return event
