from starlette.datastructures import Headers

from app.schemas.ingest import CrashIngestRequest
from app.services.crash_fingerprinting import fingerprint_hash
from app.services.location_service import derive_location


def test_fingerprint_hash_normalizes_volatile_values() -> None:
    first = CrashIngestRequest(
        project_key="axiom_pk_demo",
        error_type="RedisConnectionTimeout",
        message="Connection timed out after 5000ms request 123",
        stack="at /srv/app/index.js:10:22",
        framework="express",
    )
    second = CrashIngestRequest(
        project_key="axiom_pk_demo",
        error_type="RedisConnectionTimeout",
        message="Connection timed out after 9000ms request 456",
        stack="at /srv/app/index.js:77:91",
        framework="express",
    )

    assert fingerprint_hash(first) == fingerprint_hash(second)


def test_location_uses_runtime_region_hint() -> None:
    payload = CrashIngestRequest(
        project_key="axiom_pk_demo",
        error_type="RedisConnectionTimeout",
        message="Connection timed out",
        framework="express",
        runtime_region="us-east-1",
    )

    location = derive_location(payload, Headers({}), "high", 3)

    assert location.region == "US-East"
    assert location.country == "US"
    assert location.latitude is not None
    assert location.blast_radius > 0


def test_location_falls_back_to_unknown_region() -> None:
    payload = CrashIngestRequest(
        project_key="axiom_pk_demo",
        error_type="RedisConnectionTimeout",
        message="Connection timed out",
        framework="express",
    )

    location = derive_location(payload, Headers({}), "medium", 1)

    assert location.region == "Unknown Region"
    assert location.latitude is None
