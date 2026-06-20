from pydantic import BaseModel, Field

from app.schemas.fix import FixRead


class CrashLocation(BaseModel):
    latitude: float | None = None
    longitude: float | None = None
    region: str = "Unknown Region"
    country: str | None = None
    blast_radius: int = Field(default=0, ge=0)


class CrashIngestRequest(BaseModel):
    project_key: str = Field(min_length=6, max_length=255)
    service: str | None = Field(default=None, max_length=160)
    environment: str | None = Field(default=None, max_length=80)
    error_type: str = Field(min_length=1, max_length=160)
    message: str = Field(min_length=1, max_length=2000)
    stack: str | None = Field(default=None, max_length=20000)
    language: str = Field(default="node20", min_length=1, max_length=80)
    framework: str = Field(default="unknown", min_length=1, max_length=120)
    runtime_region: str | None = Field(default=None, max_length=120)


class CrashIngestResponse(BaseModel):
    status: str
    fingerprint_hash: str
    match_count: int
    monad_tx_hash: str
    location: CrashLocation
    known_fixes: list[FixRead]
