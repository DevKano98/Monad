from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import not_found
from app.core.x402 import PaymentReceipt
from app.models.crash_map import CrashMapPoint
from app.models.fix import Fix
from app.repositories.fingerprint_repository import FingerprintRepository
from app.repositories.fix_repository import FixRepository
from app.repositories.reputation_repository import ReputationRepository
from app.schemas.fix import FixCreate, FixVote
from app.services.blockchain_service import BlockchainService
from app.services.websocket_service import WebSocketService


class FixService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repository = FixRepository(session)
        self.fingerprints = FingerprintRepository(session)
        self.reputations = ReputationRepository(session)
        self.blockchain = BlockchainService()
        self.websocket = WebSocketService()

    async def create_fix(self, payload: FixCreate, receipt: PaymentReceipt) -> Fix:
        fingerprint = await self.fingerprints.get(payload.fingerprint_id)
        if fingerprint is None:
            raise not_found("Fingerprint")

        existing_fix_count = len(await self.repository.list_for_fingerprint(payload.fingerprint_id))
        tx = await self.blockchain.submit_fix(fingerprint.hash, payload.title, payload.description, receipt.payer)
        fix = Fix(
            fingerprint_id=payload.fingerprint_id,
            title=payload.title,
            description=payload.description,
            wallet_address=receipt.payer.lower(),
            onchain_fix_id=tx.onchain_fix_id,
            monad_tx_hash=tx.tx_hash,
        )
        self.session.add(fix)
        fingerprint_fix_count = existing_fix_count + 1
        points = await self.session.execute(
            select(CrashMapPoint).where(CrashMapPoint.fingerprint_id == payload.fingerprint_id)
        )
        for point in points.scalars():
            point.known_fix_count = fingerprint_fix_count
        await self.session.commit()
        await self.session.refresh(fix)
        await self.websocket.broadcast(
            "fix.submitted",
            {
                "id": str(fix.id),
                "fingerprint_id": str(fix.fingerprint_id),
                "onchain_fix_id": fix.onchain_fix_id,
                "tx_hash": fix.monad_tx_hash,
            },
        )
        return fix

    async def get_fix(self, fix_id: UUID) -> Fix | None:
        return await self.repository.get(fix_id)

    async def list_fixes(self, skip: int = 0, limit: int = 100) -> list[Fix]:
        return await self.repository.list(skip, limit)

    async def vote(self, fix_id: UUID, payload: FixVote, receipt: PaymentReceipt) -> Fix:
        fix = await self.repository.get(fix_id)
        if fix is None:
            raise not_found("Fix")
        if fix.onchain_fix_id is None:
            raise not_found("On-chain fix")

        tx = await self.blockchain.vote_fix(fix.onchain_fix_id, receipt.payer, payload.successful)
        if payload.successful:
            fix.upvotes += 1
            fix.reputation_score += 10
        else:
            fix.downvotes += 1
            fix.reputation_score -= 4
        fix.monad_tx_hash = tx["tx_hash"]
        await self.reputations.upsert_vote(fix.wallet_address, payload.successful)
        await self.session.commit()
        await self.session.refresh(fix)
        await self.websocket.broadcast(
            "fix.voted",
            {
                "fix_id": str(fix.id),
                "onchain_fix_id": fix.onchain_fix_id,
                "score": fix.reputation_score,
                "tx_hash": fix.monad_tx_hash,
            },
        )
        return fix
