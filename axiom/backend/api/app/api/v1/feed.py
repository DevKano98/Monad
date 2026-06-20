from fastapi import APIRouter

from app.dependencies import DatabaseSession
from app.schemas.fingerprint import FingerprintRead
from app.services.feed_service import FeedService

router = APIRouter()


@router.get("", response_model=list[FingerprintRead])
async def get_feed(db: DatabaseSession) -> list:
    return await FeedService(db).get_global_feed()
