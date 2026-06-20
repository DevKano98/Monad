from app.core.config import settings


class FingerprintRegistryClient:
    def publish_fingerprint(self, hash_value: str, language: str, framework: str, severity: str) -> str:
        if settings.private_key and settings.fingerprint_registry_address:
            return f"pending:{hash_value}"
        return f"simulated:{hash_value}:{language}:{framework}:{severity}"

    def get_fingerprint(self, hash_value: str) -> dict[str, str]:
        return {"hash": hash_value}
