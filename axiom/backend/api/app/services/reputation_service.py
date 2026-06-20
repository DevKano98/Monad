from sqlalchemy.ext.asyncio import AsyncSession

from app.models.reputation import Reputation
from app.repositories.reputation_repository import ReputationRepository


class ReputationService:
    def __init__(self, session: AsyncSession) -> None:
        self.repository = ReputationRepository(session)

    async def get_wallet_reputation(self, wallet_address: str) -> Reputation | None:
        return await self.repository.get_by_wallet(wallet_address)
