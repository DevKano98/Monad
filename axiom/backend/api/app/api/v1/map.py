from fastapi import APIRouter

from app.dependencies import DatabaseSession
from app.repositories.crash_map_repository import CrashMapRepository
from app.schemas.map import CrashMapPointRead

router = APIRouter()


@router.get("/crashes", response_model=list[CrashMapPointRead])
async def list_crashes(db: DatabaseSession, limit: int = 250) -> list:
    return await CrashMapRepository(db).list_recent(limit=limit)
