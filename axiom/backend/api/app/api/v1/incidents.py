from uuid import UUID

from fastapi import APIRouter

from app.core.exceptions import not_found
from app.dependencies import DatabaseSession
from app.schemas.incident import IncidentCreate, IncidentRead
from app.services.incident_service import IncidentService

router = APIRouter()


@router.get("", response_model=list[IncidentRead])
async def list_incidents(db: DatabaseSession) -> list:
    return await IncidentService(db).list_incidents()


@router.post("", response_model=IncidentRead, status_code=201)
async def create_incident(payload: IncidentCreate, db: DatabaseSession):
    return await IncidentService(db).create_incident(payload)


@router.get("/{incident_id}", response_model=IncidentRead)
async def get_incident(incident_id: UUID, db: DatabaseSession):
    incident = await IncidentService(db).get_incident(incident_id)
    if incident is None:
        raise not_found("Incident")
    return incident
