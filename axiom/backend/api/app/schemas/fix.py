from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FixCreate(BaseModel):
    fingerprint_id: UUID
    title: str = Field(min_length=3, max_length=255)
    description: str = Field(min_length=3)
    wallet_address: str | None = Field(default=None, min_length=10, max_length=255)


class FixVote(BaseModel):
    successful: bool
    proof_hash: str | None = None


class FixRead(FixCreate):
    id: UUID
    wallet_address: str
    onchain_fix_id: int | None
    upvotes: int
    downvotes: int
    reputation_score: float
    monad_tx_hash: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
