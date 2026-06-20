from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class FingerprintCreate(BaseModel):
    incident_id: UUID
    hash: str = Field(min_length=6, max_length=255)
    language: str = Field(min_length=1, max_length=80)
    framework: str = Field(min_length=1, max_length=120)
    severity: str = Field(pattern="^(critical|high|medium|low)$")
    monad_tx_hash: str | None = None


class FingerprintRead(FingerprintCreate):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
