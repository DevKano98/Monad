from sqlalchemy import Float, Index, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import BaseModel


class Reputation(BaseModel):
    __tablename__ = "reputations"

    wallet_address: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    total_score: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    successful_fixes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    failed_fixes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    __table_args__ = (Index("idx_reputations_wallet_address", "wallet_address"),)
