from uuid import UUID
from typing import Annotated

from fastapi import APIRouter, Depends

from app.core.exceptions import not_found
from app.core.x402 import PaymentReceipt, require_x402
from app.dependencies import DatabaseSession
from app.schemas.fix import FixCreate, FixRead, FixVote
from app.services.fix_service import FixService

router = APIRouter()


@router.get("", response_model=list[FixRead])
async def list_fixes(db: DatabaseSession) -> list:
    return await FixService(db).list_fixes()


@router.post("", response_model=FixRead, status_code=201)
async def create_fix(
    payload: FixCreate,
    db: DatabaseSession,
    receipt: Annotated[PaymentReceipt, Depends(require_x402("submit-fix"))],
):
    return await FixService(db).create_fix(payload, receipt)


@router.get("/{fix_id}", response_model=FixRead)
async def get_fix(fix_id: UUID, db: DatabaseSession):
    fix = await FixService(db).get_fix(fix_id)
    if fix is None:
        raise not_found("Fix")
    return fix


@router.post("/{fix_id}/vote", response_model=FixRead)
async def vote_fix(
    fix_id: UUID,
    payload: FixVote,
    db: DatabaseSession,
    receipt: Annotated[PaymentReceipt, Depends(require_x402("vote-fix"))],
):
    return await FixService(db).vote(fix_id, payload, receipt)
