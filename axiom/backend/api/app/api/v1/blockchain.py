from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.blockchain_service import BlockchainService

router = APIRouter()


class PublishFingerprintRequest(BaseModel):
    hash: str
    language: str
    framework: str
    severity: str
    monad_tx_hash: str | None = None


class UpdateReputationRequest(BaseModel):
    wallet_address: str
    score: float
    successful_fixes: int
    failed_fixes: int
    monad_tx_hash: str | None = None


@router.post("/publish-fingerprint")
async def publish_fingerprint(payload: PublishFingerprintRequest) -> dict[str, Any]:
    return await BlockchainService().publish_fingerprint(payload.model_dump())


@router.post("/update-reputation")
async def update_reputation(payload: UpdateReputationRequest) -> dict[str, Any]:
    return await BlockchainService().update_reputation(payload.model_dump())
