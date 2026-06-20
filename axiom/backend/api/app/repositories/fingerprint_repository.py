from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.fingerprint import Fingerprint
from app.repositories.base import Repository


class FingerprintRepository(Repository[Fingerprint]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Fingerprint)

    async def get_by_hash(self, fingerprint_hash: str) -> Fingerprint | None:
        result = await self.session.execute(select(Fingerprint).where(Fingerprint.hash == fingerprint_hash))
        return result.scalar_one_or_none()
