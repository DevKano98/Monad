from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class CrashMapPointRead(BaseModel):
    id: UUID
    fingerprint_id: UUID
    fingerprint_hash: str
    error_type: str
    severity: str
    match_count: int
    known_fix_count: int
    latitude: float | None
    longitude: float | None
    region: str
    country: str | None
    blast_radius: int
    monad_tx_hash: str | None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
