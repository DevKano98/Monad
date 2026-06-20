import uuid

from sqlalchemy import Float, ForeignKey, Index, Integer, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Fix(BaseModel):
    __tablename__ = "fixes"

    fingerprint_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("fingerprints.id", ondelete="CASCADE"), nullable=False
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    wallet_address: Mapped[str] = mapped_column(String(255), nullable=False)
    onchain_fix_id: Mapped[int | None] = mapped_column(Integer)
    upvotes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    downvotes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    reputation_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    monad_tx_hash: Mapped[str | None] = mapped_column(String(255))

    fingerprint: Mapped["Fingerprint"] = relationship("Fingerprint", back_populates="fixes")

    __table_args__ = (
        Index("idx_fixes_fingerprint_id", "fingerprint_id"),
        Index("idx_fixes_wallet_address", "wallet_address"),
    )
