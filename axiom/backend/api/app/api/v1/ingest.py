from fastapi import APIRouter, Request

from app.dependencies import DatabaseSession
from app.schemas.ingest import CrashIngestRequest, CrashIngestResponse
from app.services.crash_ingest_service import CrashIngestService

router = APIRouter()


@router.post("/ingest", response_model=CrashIngestResponse)
async def ingest_crash(payload: CrashIngestRequest, request: Request, db: DatabaseSession) -> CrashIngestResponse:
    return await CrashIngestService(db).ingest(payload, request.headers)
