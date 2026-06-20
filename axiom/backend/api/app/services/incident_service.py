from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.models.incident import Incident
from app.repositories.incident_repository import IncidentRepository
from app.schemas.incident import IncidentCreate
from app.services.websocket_service import WebSocketService


class IncidentService:
    def __init__(self, session: AsyncSession) -> None:
        self.repository = IncidentRepository(session)
        self.websocket = WebSocketService()

    async def create_incident(self, payload: IncidentCreate) -> Incident:
        incident = await self.repository.create(payload.model_dump())
        await self.websocket.broadcast("incident.created", {"id": str(incident.id), "title": incident.title})
        return incident

    async def get_incident(self, incident_id: UUID) -> Incident | None:
        return await self.repository.get(incident_id)

    async def list_incidents(self, skip: int = 0, limit: int = 100) -> list[Incident]:
        return await self.repository.list(skip, limit)
