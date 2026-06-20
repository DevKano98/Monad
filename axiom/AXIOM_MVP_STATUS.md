# Axiom MVP Status

## Current Condition

The repo now contains the MVP implementation for the Axiom crash pipeline, deterministic fingerprinting, Monad-backed public state transitions, fix/vote x402 gating, and the realtime crash map UI.

The code is in a buildable state:

- Frontend production build passes.
- Foundry contract tests pass.
- Backend unit tests for the new deterministic helpers and x402 paths pass under a local Python 3.11 virtualenv.
- Python 3.13 on this machine could not install the pinned backend dependencies, so backend verification was run in a local 3.11 venv instead.

## What I Changed

### Contracts

- Reworked `contracts/src/FingerprintRegistry.sol` to support:
  - `publishFingerprint`
  - `reportMatch`
  - `submitFix`
  - `vote`
- Added fix storage and duplicate vote protection.
- Expanded the ABI artifact at `contracts/abi/FingerprintRegistry.json`.
- Switched the contract workspace to Foundry via `contracts/foundry.toml`.
- Updated `contracts/package.json` scripts to use `forge build`, `forge test`, and `forge script`.
- Expanded contract tests in `contracts/test/FingerprintRegistry.t.sol` to cover:
  - publish
  - duplicate publish rejection
  - match increments
  - fix submission
  - vote
  - duplicate vote rejection

### Backend

- Added deterministic crash normalization and hashing in:
  - `backend/api/app/services/crash_fingerprinting.py`
- Added approximate location derivation and blast-radius computation in:
  - `backend/api/app/services/location_service.py`
- Added ingest pipeline service in:
  - `backend/api/app/services/crash_ingest_service.py`
- Added crash map mirror repository in:
  - `backend/api/app/repositories/crash_map_repository.py`
- Added new public API endpoints:
  - `POST /v1/ingest`
  - `GET /v1/map/crashes`
- Routed the new endpoints through the main API router.
- Changed fix submit/vote routes to require x402 proof:
  - `POST /v1/fixes`
  - `POST /v1/fixes/{fix_id}/vote`
- Updated the blockchain service to use real `web3.py` transaction sends instead of simulated tx hashes.
- Added new mirror fields and models for:
  - approximate latitude/longitude
  - region/country
  - blast radius
  - match count
  - on-chain fix id
  - crash map points
- Updated config/env handling for:
  - `PROJECT_KEYS`
  - `MONAD_PRIORITY_FEE_GWEI`
  - x402 pricing for fix submit and vote
- Kept the old fingerprint creation path, but it now also routes through the chain-first flow.

### Packages

- Added `packages/crash-reporter`:
  - Node crash reporter for runtime hooks and direct ingest posting
- Added `packages/mcp`:
  - lightweight MCP-facing helper for failure lookup and fix actions
- Expanded shared TS contracts in `packages/api-contracts/index.ts`
  - fingerprint fields
  - crash map point shape

### Frontend

- Added a realtime Leaflet/OpenStreetMap crash map.
- Added a dedicated map page.
- Added a compact crash map panel to the dashboard.
- Updated the feed card to show:
  - error type
  - fingerprint hash
  - match count
  - Monad tx hash
- Wired socket invalidation to refresh the crash map query on realtime events.
- Added Vite env typings and map styling.

### Schema / Infra

- Updated `database/schema.sql` for the new fingerprint and crash-map fields.
- Updated `.env.example` with the new environment variables.
- Added `package-lock.json` from the npm install that was required to run the frontend and contract verification.

## Tests Run

### Passed

- `python -m compileall app` in `backend/api`
- `PYTEST_DISABLE_PLUGIN_AUTOLOAD=1 .venv/bin/python -m pytest app/tests/unit/test_crash_ingest_helpers.py app/tests/unit/test_x402.py`
- `npm run build:web`
- `npm --workspace contracts run test`

### Verification Notes

- Backend tests required a local Python 3.11 virtualenv because the system Python 3.13 could not build the pinned `asyncpg` and `pydantic-core` wheels.
- Pytest plugin autoload had to be disabled because Web3’s optional pytest plugin was being loaded transitively and causing an import failure during collection.

## What Is Still Pending

- No live end-to-end run was performed against a real Postgres instance, Redis instance, or Monad RPC endpoint.
- The new blockchain service has not been exercised against an actual deployed Monad testnet contract.
- The crash reporter and MCP packages were added as thin workspace packages, but they were not separately published or runtime-tested in a host application.
- The frontend map was built and compiled, but I did not run a browser-based visual pass in this turn.

## Residual Risk

- `backend/api/app/services/blockchain_service.py` depends on valid Monad relayer settings and a deployed registry address at runtime.
- The ABI path resolution assumes the backend can see the repo contract artifact path at runtime.
- The ingest pipeline currently uses deterministic severity classification and approximate location inference based on headers/runtime hints; this is privacy-preserving, but it is still heuristic.

## Files With the Main Functional Changes

- `/Users/aditya/Developer/MOnad/Monad/axiom/contracts/src/FingerprintRegistry.sol`
- `/Users/aditya/Developer/MOnad/Monad/axiom/backend/api/app/services/crash_ingest_service.py`
- `/Users/aditya/Developer/MOnad/Monad/axiom/backend/api/app/services/blockchain_service.py`
- `/Users/aditya/Developer/MOnad/Monad/axiom/apps/web/src/components/map/CrashMap.tsx`
- `/Users/aditya/Developer/MOnad/Monad/axiom/apps/web/src/pages/MapPage.tsx`

