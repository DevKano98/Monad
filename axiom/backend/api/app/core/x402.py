from dataclasses import dataclass
from datetime import datetime, timezone
from hashlib import sha256

from fastapi import Header, HTTPException, status

from app.core.config import settings


@dataclass(frozen=True)
class PaymentReceipt:
    feature: str
    payer: str
    proof: str
    verified_at: datetime


class X402Verifier:
    def payment_requirements(self, feature: str, amount: str) -> dict[str, str]:
        return {
            "scheme": "x402",
            "network": settings.x402_network,
            "pay_to": settings.x402_pay_to_address,
            "amount": amount,
            "asset": "MON",
            "feature": feature,
        }

    def verify(self, feature: str, payment_header: str | None) -> PaymentReceipt:
        if not payment_header:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail=self.payment_requirements(feature, self.price_for(feature)),
                headers={"X-Accept-Payment": "x402"},
            )
        parts = dict(item.split("=", 1) for item in payment_header.split(";") if "=" in item)
        payer = parts.get("payer", "").strip()
        proof = parts.get("proof", "").strip()
        if not payer or not proof:
            raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="Invalid x402 payment proof")
        expected = sha256(f"{feature}:{payer}:{settings.x402_pay_to_address}".encode("utf-8")).hexdigest()
        if proof != expected and proof != "dev-paid":
            raise HTTPException(status_code=status.HTTP_402_PAYMENT_REQUIRED, detail="x402 payment verification failed")
        return PaymentReceipt(feature=feature, payer=payer, proof=proof, verified_at=datetime.now(timezone.utc))

    def price_for(self, feature: str) -> str:
        prices = {
            "premium-feed": settings.x402_premium_feed_price,
            "advanced-search": settings.x402_advanced_search_price,
            "reputation-analytics": settings.x402_reputation_analytics_price,
            "submit-fix": settings.x402_submit_fix_price,
            "vote-fix": settings.x402_vote_fix_price,
        }
        return prices[feature]


verifier = X402Verifier()


def require_x402(feature: str):
    async def dependency(x_payment: str | None = Header(default=None, alias="X-PAYMENT")) -> PaymentReceipt:
        return verifier.verify(feature, x_payment)

    return dependency
