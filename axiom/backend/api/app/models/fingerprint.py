import uuid

from sqlalchemy import Float, ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Fingerprint(BaseModel):
    __tablename__ = "fingerprints"

    incident_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("incidents.id", ondelete="CASCADE"), nullable=False
    )
    hash: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    error_type: Mapped[str] = mapped_column(String(160), nullable=False, default="UnknownError")
    language: Mapped[str] = mapped_column(String(80), nullable=False)
    framework: Mapped[str] = mapped_column(String(120), nullable=False)
    severity: Mapped[str] = mapped_column(String(50), nullable=False)
    match_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    region: Mapped[str | None] = mapped_column(String(120))
    country: Mapped[str | None] = mapped_column(String(2))
    blast_radius: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    monad_tx_hash: Mapped[str | None] = mapped_column(String(255))

    incident: Mapped["Incident"] = relationship("Incident", back_populates="fingerprints")
    fixes: Mapped[list["Fix"]] = relationship("Fix", back_populates="fingerprint", cascade="all, delete-orphan")
    crash_points: Mapped[list["CrashMapPoint"]] = relationship(
        "CrashMapPoint", back_populates="fingerprint", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("idx_fingerprints_hash", "hash"),
        Index("idx_fingerprints_incident_id", "incident_id"),
        Index("idx_fingerprints_region", "region"),
    )
