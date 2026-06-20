CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TYPE incident_severity AS ENUM ('critical', 'high', 'medium', 'low');
CREATE TYPE incident_status AS ENUM ('open', 'investigating', 'resolved');

CREATE TABLE IF NOT EXISTS incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity incident_severity NOT NULL,
    status incident_status NOT NULL DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fingerprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    incident_id UUID NOT NULL REFERENCES incidents(id) ON DELETE CASCADE,
    hash VARCHAR(255) NOT NULL UNIQUE,
    error_type VARCHAR(160) NOT NULL DEFAULT 'UnknownError',
    language VARCHAR(80) NOT NULL,
    framework VARCHAR(120) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    match_count INTEGER NOT NULL DEFAULT 1,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    region VARCHAR(120),
    country VARCHAR(2),
    blast_radius INTEGER NOT NULL DEFAULT 0,
    monad_tx_hash VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS fixes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint_id UUID NOT NULL REFERENCES fingerprints(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    wallet_address VARCHAR(255) NOT NULL,
    onchain_fix_id INTEGER,
    upvotes INTEGER NOT NULL DEFAULT 0,
    downvotes INTEGER NOT NULL DEFAULT 0,
    reputation_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    monad_tx_hash VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS crash_map_points (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fingerprint_id UUID NOT NULL REFERENCES fingerprints(id) ON DELETE CASCADE,
    fingerprint_hash VARCHAR(255) NOT NULL,
    error_type VARCHAR(160) NOT NULL,
    severity VARCHAR(50) NOT NULL,
    match_count INTEGER NOT NULL DEFAULT 1,
    known_fix_count INTEGER NOT NULL DEFAULT 0,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    region VARCHAR(120) NOT NULL DEFAULT 'Unknown Region',
    country VARCHAR(2),
    blast_radius INTEGER NOT NULL DEFAULT 0,
    monad_tx_hash VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reputations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wallet_address VARCHAR(255) NOT NULL UNIQUE,
    total_score DOUBLE PRECISION NOT NULL DEFAULT 0,
    successful_fixes INTEGER NOT NULL DEFAULT 0,
    failed_fixes INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);
CREATE INDEX IF NOT EXISTS idx_incidents_created_at ON incidents(created_at);
CREATE INDEX IF NOT EXISTS idx_fingerprints_hash ON fingerprints(hash);
CREATE INDEX IF NOT EXISTS idx_fingerprints_incident_id ON fingerprints(incident_id);
CREATE INDEX IF NOT EXISTS idx_fingerprints_region ON fingerprints(region);
CREATE INDEX IF NOT EXISTS idx_fixes_fingerprint_id ON fixes(fingerprint_id);
CREATE INDEX IF NOT EXISTS idx_fixes_wallet_address ON fixes(wallet_address);
CREATE INDEX IF NOT EXISTS idx_reputations_wallet_address ON reputations(wallet_address);
CREATE INDEX IF NOT EXISTS idx_crash_map_points_hash_region ON crash_map_points(fingerprint_hash, region);
CREATE INDEX IF NOT EXISTS idx_crash_map_points_created_at ON crash_map_points(created_at);
