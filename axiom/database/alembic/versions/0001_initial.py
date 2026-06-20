from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    severity = postgresql.ENUM("critical", "high", "medium", "low", name="incident_severity")
    status = postgresql.ENUM("open", "investigating", "resolved", name="incident_status")
    severity.create(op.get_bind(), checkfirst=True)
    status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "incidents",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("severity", severity, nullable=False),
        sa.Column("status", status, nullable=False, server_default="open"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_incidents_status", "incidents", ["status"])
    op.create_index("idx_incidents_created_at", "incidents", ["created_at"])

    op.create_table(
        "fingerprints",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("incident_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("incidents.id", ondelete="CASCADE")),
        sa.Column("hash", sa.String(length=255), nullable=False, unique=True),
        sa.Column("language", sa.String(length=80), nullable=False),
        sa.Column("framework", sa.String(length=120), nullable=False),
        sa.Column("severity", sa.String(length=50), nullable=False),
        sa.Column("monad_tx_hash", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_fingerprints_hash", "fingerprints", ["hash"])
    op.create_index("idx_fingerprints_incident_id", "fingerprints", ["incident_id"])

    op.create_table(
        "fixes",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("fingerprint_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("fingerprints.id", ondelete="CASCADE")),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("wallet_address", sa.String(length=255), nullable=False),
        sa.Column("upvotes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("downvotes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("reputation_score", sa.Float(), nullable=False, server_default="0"),
        sa.Column("monad_tx_hash", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_fixes_fingerprint_id", "fixes", ["fingerprint_id"])
    op.create_index("idx_fixes_wallet_address", "fixes", ["wallet_address"])

    op.create_table(
        "reputations",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("wallet_address", sa.String(length=255), nullable=False, unique=True),
        sa.Column("total_score", sa.Float(), nullable=False, server_default="0"),
        sa.Column("successful_fixes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("failed_fixes", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("idx_reputations_wallet_address", "reputations", ["wallet_address"])


def downgrade() -> None:
    op.drop_table("reputations")
    op.drop_table("fixes")
    op.drop_table("fingerprints")
    op.drop_table("incidents")
    postgresql.ENUM(name="incident_status").drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM(name="incident_severity").drop(op.get_bind(), checkfirst=True)
