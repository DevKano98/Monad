from dataclasses import dataclass
from math import log2

from starlette.datastructures import Headers

from app.schemas.ingest import CrashIngestRequest


@dataclass(frozen=True)
class DerivedLocation:
    latitude: float | None
    longitude: float | None
    region: str
    country: str | None
    blast_radius: int


REGION_COORDINATES: dict[str, tuple[float, float, str, str]] = {
    "us-east-1": (39.0, -77.5, "US-East", "US"),
    "us-east-2": (40.4, -82.9, "US-East", "US"),
    "us-west-1": (37.3, -121.9, "US-West", "US"),
    "us-west-2": (45.5, -122.7, "US-West", "US"),
    "eu-west-1": (53.3, -6.2, "EU-West", "IE"),
    "eu-central-1": (50.1, 8.7, "EU-Central", "DE"),
    "ap-south-1": (19.1, 72.9, "AP-South", "IN"),
    "ap-southeast-1": (1.3, 103.8, "AP-Southeast", "SG"),
}

COUNTRY_COORDINATES: dict[str, tuple[float, float, str]] = {
    "US": (39.8, -98.6, "United States"),
    "IN": (22.9, 78.9, "India"),
    "GB": (54.5, -2.4, "United Kingdom"),
    "DE": (51.2, 10.4, "Germany"),
    "IE": (53.4, -8.2, "Ireland"),
    "SG": (1.3, 103.8, "Singapore"),
}

SEVERITY_BASE_RADIUS = {"critical": 70, "high": 52, "medium": 34, "low": 20}


def derive_location(payload: CrashIngestRequest, headers: Headers, severity: str, match_count: int) -> DerivedLocation:
    region_hint = (
        payload.runtime_region
        or headers.get("x-axiom-region")
        or headers.get("x-cloud-region")
        or headers.get("fly-region")
        or ""
    ).lower()
    if region_hint in REGION_COORDINATES:
        latitude, longitude, region, country = REGION_COORDINATES[region_hint]
        return DerivedLocation(latitude, longitude, region, country, blast_radius(severity, match_count))

    country = (headers.get("cf-ipcountry") or headers.get("x-vercel-ip-country") or "").upper()
    if country in COUNTRY_COORDINATES:
        latitude, longitude, region = COUNTRY_COORDINATES[country]
        return DerivedLocation(latitude, longitude, region, country, blast_radius(severity, match_count))

    return DerivedLocation(None, None, "Unknown Region", None, blast_radius(severity, match_count))


def blast_radius(severity: str, match_count: int) -> int:
    base = SEVERITY_BASE_RADIUS.get(severity, SEVERITY_BASE_RADIUS["medium"])
    spread = int(log2(max(match_count, 1)) * 12)
    return min(base + spread, 180)
