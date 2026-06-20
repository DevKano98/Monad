from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import not_found
from app.models.fix import Fix
from app.repositories.fix_repository import FixRepository
from app.repositories.reputation_repository import ReputationRepository
from app.schemas.fix import FixCreate, FixVote
from app.services.websocket_service import WebSocketService


class FixService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repository = FixRepository(session)
        self.reputations = ReputationRepository(session)
        self.websocket = WebSocketService()

    async def create_fix(self, payload: FixCreate) -> Fix:
        fix = await self.repository.create(payload.model_dump())
        await self.websocket.broadcast("fix.created", {"id": str(fix.id), "fingerprint_id": str(fix.fingerprint_id)})
        return fix

    async def get_fix(self, fix_id: UUID) -> Fix | None:
        return await self.repository.get(fix_id)

    async def list_fixes(self, skip: int = 0, limit: int = 100) -> list[Fix]:
        return await self.repository.list(skip, limit)

    async def vote(self, fix_id: UUID, payload: FixVote) -> Fix:
        fix = await self.repository.get(fix_id)
        if fix is None:
            raise not_found("Fix")
        if payload.successful:
            fix.upvotes += 1
            fix.reputation_score += 10
        else:
            fix.downvotes += 1
            fix.reputation_score -= 4
        await self.reputations.upsert_vote(fix.wallet_address, payload.successful)
        await self.session.commit()
        await self.session.refresh(fix)
        await self.websocket.broadcast("reputation.updated", {"fix_id": str(fix.id), "score": fix.reputation_score})
        return fix
