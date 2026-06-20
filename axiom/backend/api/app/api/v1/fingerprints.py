from uuid import UUID

from fastapi import APIRouter

from app.core.exceptions import not_found
from app.dependencies import DatabaseSession
from app.schemas.fingerprint import FingerprintCreate, FingerprintRead
from app.services.fingerprint_service import FingerprintService

router = APIRouter()


@router.get("", response_model=list[FingerprintRead])
async def list_fingerprints(db: DatabaseSession) -> list:
    return await FingerprintService(db).list_fingerprints()


@router.post("", response_model=FingerprintRead, status_code=201)
async def create_fingerprint(payload: FingerprintCreate, db: DatabaseSession):
    return await FingerprintService(db).create_fingerprint(payload)


@router.get("/{fingerprint_id}", response_model=FingerprintRead)
async def get_fingerprint(fingerprint_id: UUID, db: DatabaseSession):
    fingerprint = await FingerprintService(db).get_fingerprint(fingerprint_id)
    if fingerprint is None:
        raise not_found("Fingerprint")
    return fingerprint
