from app.core.config import settings


class ReputationRegistryClient:
    def update_reputation(self, wallet: str, score: int, successful_fixes: int, failed_fixes: int) -> str:
        if settings.private_key and settings.reputation_registry_address:
            return f"pending:{wallet}"
        return f"simulated:{wallet}:{score}:{successful_fixes}:{failed_fixes}"

    def get_reputation(self, wallet: str) -> dict[str, int | str]:
        return {"wallet": wallet, "score": 0, "successful_fixes": 0, "failed_fixes": 0}
