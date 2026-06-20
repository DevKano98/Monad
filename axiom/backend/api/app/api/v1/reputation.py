from fastapi import APIRouter

from app.core.exceptions import not_found
from app.dependencies import DatabaseSession
from app.schemas.reputation import ReputationRead
from app.services.reputation_service import ReputationService

router = APIRouter()


@router.get("/{wallet_address}", response_model=ReputationRead)
async def get_reputation(wallet_address: str, db: DatabaseSession):
    reputation = await ReputationService(db).get_wallet_reputation(wallet_address)
    if reputation is None:
        raise not_found("Reputation")
    return reputation
