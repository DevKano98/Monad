from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ReputationRead(BaseModel):
    id: UUID
    wallet_address: str
    total_score: float
    successful_fixes: int
    failed_fixes: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
