from uuid import UUID

from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.fix import Fix
from app.repositories.base import Repository


class FixRepository(Repository[Fix]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Fix)

    async def list_for_fingerprint(self, fingerprint_id: UUID, limit: int = 10) -> list[Fix]:
        result = await self.session.execute(
            select(Fix)
            .where(Fix.fingerprint_id == fingerprint_id)
            .order_by(desc(Fix.reputation_score))
            .limit(limit)
        )
        return list(result.scalars().all())
