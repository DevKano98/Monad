from sqlalchemy.ext.asyncio import AsyncSession

from app.models.incident import Incident
from app.repositories.base import Repository


class IncidentRepository(Repository[Incident]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session, Incident)
