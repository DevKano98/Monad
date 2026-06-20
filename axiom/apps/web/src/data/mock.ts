import type { CrashMapPoint, Fingerprint, Incident } from "../types";

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "inc_mock_001",
    title: "RedisConnectionTimeout",
    description: "Node.js worker timed out while reaching Redis 7.2 during a burst write.",
    severity: "high",
    status: "investigating",
    created_at: "2026-06-20T10:15:00.000Z",
    updated_at: "2026-06-20T10:18:00.000Z"
  },
  {
    id: "inc_mock_002",
    title: "MongoQueryLatencySpike",
    description: "Read latency jumped above SLA during the europe rollout window.",
    severity: "medium",
    status: "open",
    created_at: "2026-06-20T09:50:00.000Z",
    updated_at: "2026-06-20T09:53:00.000Z"
  }
];

export const MOCK_FINGERPRINTS: Fingerprint[] = [
  {
    id: "fp_mock_001",
    incident_id: "inc_mock_001",
    hash: "redis-timeout-node18-redis72",
    error_type: "RedisConnectionTimeout",
    language: "nodejs",
    framework: "express",
    severity: "high",
    match_count: 14,
    latitude: 19.076,
    longitude: 72.8777,
    region: "AP-South",
    country: "IN",
    blast_radius: 52,
    monad_tx_hash: "0x9d2b8f0c6a2f4cde1b7d8a2f4c61f3d9c6f1e2a7d3c4b5a6f7e8d9c0b1a2f3e4",
    created_at: "2026-06-20T10:14:00.000Z",
    updated_at: "2026-06-20T10:18:00.000Z"
  },
  {
    id: "fp_mock_002",
    incident_id: "inc_mock_002",
    hash: "mongo-latency-go-api-prod",
    error_type: "MongoQueryLatencySpike",
    language: "go",
    framework: "gin",
    severity: "medium",
    match_count: 8,
    latitude: 53.3498,
    longitude: -6.2603,
    region: "EU-West",
    country: "IE",
    blast_radius: 34,
    monad_tx_hash: "0x3b8f8a4c6d5e1f2a9b7c8d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c",
    created_at: "2026-06-20T09:48:00.000Z",
    updated_at: "2026-06-20T09:53:00.000Z"
  }
];

export const MOCK_CRASH_MAP_POINTS: CrashMapPoint[] = [
  {
    id: "map_mock_001",
    fingerprint_id: "fp_mock_001",
    fingerprint_hash: "redis-timeout-node18-redis72",
    error_type: "RedisConnectionTimeout",
    severity: "high",
    match_count: 14,
    known_fix_count: 3,
    latitude: 19.076,
    longitude: 72.8777,
    region: "AP-South",
    country: "IN",
    blast_radius: 52,
    monad_tx_hash: "0x9d2b8f0c6a2f4cde1b7d8a2f4c61f3d9c6f1e2a7d3c4b5a6f7e8d9c0b1a2f3e4",
    created_at: "2026-06-20T10:14:00.000Z",
    updated_at: "2026-06-20T10:18:00.000Z"
  },
  {
    id: "map_mock_002",
    fingerprint_id: "fp_mock_002",
    fingerprint_hash: "mongo-latency-go-api-prod",
    error_type: "MongoQueryLatencySpike",
    severity: "medium",
    match_count: 8,
    known_fix_count: 1,
    latitude: 53.3498,
    longitude: -6.2603,
    region: "EU-West",
    country: "IE",
    blast_radius: 34,
    monad_tx_hash: "0x3b8f8a4c6d5e1f2a9b7c8d0e1f2a3b4c5d6e7f8091a2b3c4d5e6f708192a3b4c",
    created_at: "2026-06-20T09:48:00.000Z",
    updated_at: "2026-06-20T09:53:00.000Z"
  }
];
