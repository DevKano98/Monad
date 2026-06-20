from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class IncidentCreate(BaseModel):
    title: str = Field(min_length=3, max_length=255)
    description: str | None = None
    severity: str = Field(pattern="^(critical|high|medium|low)$")
    status: str = Field(default="open", pattern="^(open|investigating|resolved)$")


class IncidentRead(IncidentCreate):
    id: UUID
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
