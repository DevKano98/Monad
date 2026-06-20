import uuid

from sqlalchemy import Float, ForeignKey, Index, Integer, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class CrashMapPoint(BaseModel):
    __tablename__ = "crash_map_points"

    fingerprint_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("fingerprints.id", ondelete="CASCADE"), nullable=False
    )
    fingerprint_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    error_type: Mapped[str] = mapped_column(String(160), nullable=False)
    severity: Mapped[str] = mapped_column(String(50), nullable=False)
    match_count: Mapped[int] = mapped_column(Integer, default=1, nullable=False)
    known_fix_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    latitude: Mapped[float | None] = mapped_column(Float)
    longitude: Mapped[float | None] = mapped_column(Float)
    region: Mapped[str] = mapped_column(String(120), default="Unknown Region", nullable=False)
    country: Mapped[str | None] = mapped_column(String(2))
    blast_radius: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    monad_tx_hash: Mapped[str | None] = mapped_column(String(255))

    fingerprint: Mapped["Fingerprint"] = relationship("Fingerprint", back_populates="crash_points")

    __table_args__ = (
        Index("idx_crash_map_points_hash_region", "fingerprint_hash", "region"),
        Index("idx_crash_map_points_created_at", "created_at"),
    )
