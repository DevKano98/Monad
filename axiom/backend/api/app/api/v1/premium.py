from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy import desc, func, select

from app.core.x402 import PaymentReceipt, require_x402
from app.dependencies import DatabaseSession
from app.models.fingerprint import Fingerprint
from app.models.fix import Fix
from app.models.reputation import Reputation
from app.schemas.fingerprint import FingerprintRead

router = APIRouter()


@router.get("/feed", response_model=list[FingerprintRead])
async def premium_feed(
    db: DatabaseSession,
    receipt: Annotated[PaymentReceipt, Depends(require_x402("premium-feed"))],
    limit: int = Query(default=100, ge=1, le=250),
) -> list[Fingerprint]:
    result = await db.execute(select(Fingerprint).order_by(desc(Fingerprint.created_at)).limit(limit))
    return list(result.scalars().all())


@router.get("/search")
async def advanced_search(
    db: DatabaseSession,
    receipt: Annotated[PaymentReceipt, Depends(require_x402("advanced-search"))],
    query: str = Query(min_length=2),
) -> dict[str, object]:
    pattern = f"%{query.lower()}%"
    result = await db.execute(
        select(Fingerprint).where(
            func.lower(Fingerprint.hash).like(pattern)
            | func.lower(Fingerprint.language).like(pattern)
            | func.lower(Fingerprint.framework).like(pattern)
        )
    )
    items = list(result.scalars().all())
    return {"receipt": receipt.__dict__, "items": [FingerprintRead.model_validate(item).model_dump() for item in items]}


@router.get("/reputation-analytics")
async def reputation_analytics(
    db: DatabaseSession,
    receipt: Annotated[PaymentReceipt, Depends(require_x402("reputation-analytics"))],
) -> dict[str, object]:
    top_wallets = await db.execute(select(Reputation).order_by(desc(Reputation.total_score)).limit(25))
    top_fixes = await db.execute(select(Fix).order_by(desc(Fix.reputation_score)).limit(25))
    return {
        "receipt": receipt.__dict__,
        "top_wallets": [wallet.wallet_address for wallet in top_wallets.scalars().all()],
        "top_fixes": [str(fix.id) for fix in top_fixes.scalars().all()],
    }
