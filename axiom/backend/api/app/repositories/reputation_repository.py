from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.reputation import Reputation
from app.repositories.base import Repository


class ReputationRepository(Repository[Reputation]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Reputation)

    async def get_by_wallet(self, wallet_address: str) -> Reputation | None:
        result = await self.session.execute(
            select(Reputation).where(Reputation.wallet_address == wallet_address.lower())
        )
        return result.scalar_one_or_none()

    async def upsert_vote(self, wallet_address: str, successful: bool) -> Reputation:
        reputation = await self.get_by_wallet(wallet_address)
        if reputation is None:
            reputation = Reputation(
                wallet_address=wallet_address.lower(),
                successful_fixes=0,
                failed_fixes=0,
                total_score=0.0,
            )
            self.session.add(reputation)
        if successful:
            reputation.successful_fixes += 1
            reputation.total_score += 10
        else:
            reputation.failed_fixes += 1
            reputation.total_score -= 4
        await self.session.commit()
        await self.session.refresh(reputation)
        return reputation
