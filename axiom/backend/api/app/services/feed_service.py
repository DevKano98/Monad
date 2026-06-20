from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.fingerprint import Fingerprint


class FeedService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_global_feed(self, limit: int = 50) -> list[Fingerprint]:
        result = await self.session.execute(select(Fingerprint).order_by(desc(Fingerprint.created_at)).limit(limit))
        return list(result.scalars().all())
