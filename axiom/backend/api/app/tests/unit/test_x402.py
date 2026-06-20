from hashlib import sha256

import pytest
from fastapi import HTTPException

from app.core.config import settings
from app.core.x402 import verifier


def test_x402_accepts_valid_dev_receipt() -> None:
    receipt = verifier.verify("premium-feed", "payer=0xabc;proof=dev-paid")
    assert receipt.feature == "premium-feed"
    assert receipt.payer == "0xabc"


def test_x402_accepts_deterministic_receipt() -> None:
    proof = sha256(f"advanced-search:0xabc:{settings.x402_pay_to_address}".encode("utf-8")).hexdigest()
    receipt = verifier.verify("advanced-search", f"payer=0xabc;proof={proof}")
    assert receipt.proof == proof


def test_x402_rejects_missing_receipt() -> None:
    with pytest.raises(HTTPException) as exc:
        verifier.verify("reputation-analytics", None)
    assert exc.value.status_code == 402


def test_x402_supports_fix_features() -> None:
    assert verifier.price_for("submit-fix") == settings.x402_submit_fix_price
    assert verifier.price_for("vote-fix") == settings.x402_vote_fix_price
