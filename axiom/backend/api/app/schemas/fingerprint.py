from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FingerprintCreate(BaseModel):
    incident_id: UUID
    hash: str = Field(min_length=6, max_length=255)
    error_type: str = Field(default="UnknownError", min_length=1, max_length=160)
    language: str = Field(min_length=1, max_length=80)
    framework: str = Field(min_length=1, max_length=120)
    severity: str = Field(pattern="^(critical|high|medium|low)$")
    match_count: int = Field(default=1, ge=1)
    latitude: float | None = None
    longitude: float | None = None
    region: str | None = Field(default=None, max_length=120)
    country: str | None = Field(default=None, min_length=2, max_length=2)
    blast_radius: int = Field(default=0, ge=0)
    monad_tx_hash: str | None = None


class FingerprintRead(FingerprintCreate):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
