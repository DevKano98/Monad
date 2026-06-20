import enum

from sqlalchemy import Enum, Index, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import BaseModel


class Severity(str, enum.Enum):
    critical = "critical"
    high = "high"
    medium = "medium"
    low = "low"


class IncidentStatus(str, enum.Enum):
    open = "open"
    investigating = "investigating"
    resolved = "resolved"


class Incident(BaseModel):
    __tablename__ = "incidents"

    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str | None] = mapped_column(Text)
    severity: Mapped[Severity] = mapped_column(Enum(Severity, name="incident_severity"), nullable=False)
    status: Mapped[IncidentStatus] = mapped_column(
        Enum(IncidentStatus, name="incident_status"), default=IncidentStatus.open, nullable=False
    )

    fingerprints: Mapped[list["Fingerprint"]] = relationship(
        "Fingerprint", back_populates="incident", cascade="all, delete-orphan"
    )

    __table_args__ = (
        Index("idx_incidents_status", "status"),
        Index("idx_incidents_created_at", "created_at"),
    )
