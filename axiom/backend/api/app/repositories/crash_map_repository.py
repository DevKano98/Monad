from sqlalchemy import desc, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.crash_map import CrashMapPoint
from app.repositories.base import Repository


class CrashMapRepository(Repository[CrashMapPoint]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, CrashMapPoint)

    async def find_point(
        self,
        fingerprint_hash: str,
        region: str,
        latitude: float | None,
        longitude: float | None,
    ) -> CrashMapPoint | None:
        statement = select(CrashMapPoint).where(
            CrashMapPoint.fingerprint_hash == fingerprint_hash,
            CrashMapPoint.region == region,
        )
        if latitude is None or longitude is None:
            statement = statement.where(CrashMapPoint.latitude.is_(None), CrashMapPoint.longitude.is_(None))
        else:
            statement = statement.where(CrashMapPoint.latitude == latitude, CrashMapPoint.longitude == longitude)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def list_recent(self, limit: int = 250) -> list[CrashMapPoint]:
        result = await self.session.execute(select(CrashMapPoint).order_by(desc(CrashMapPoint.updated_at)).limit(limit))
        return list(result.scalars().all())
