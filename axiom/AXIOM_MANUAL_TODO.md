# Axiom Manual TODO

This file lists the remaining manual steps needed to finish the MVP in a real environment.

## 1. Provision Runtime Infrastructure

- [ ] Start or point the backend at a real Postgres instance.
- [ ] Start or point the backend at a real Redis instance.
- [ ] Confirm the Monad RPC endpoint you want to use for testnet.
- [ ] Confirm the deployed Monad registry contract address.
- [ ] Confirm the x402 payment recipient address.

### Example environment values

```bash
DATABASE_URL=postgresql+asyncpg://axiom:axiom@localhost:5432/axiom
REDIS_URL=rediss://default:YOUR_UPSTASH_PASSWORD@YOUR_UPSTASH_HOST:YOUR_UPSTASH_PORT/0
MONAD_RPC_URL=https://testnet-rpc.monad.xyz
MONAD_CHAIN_ID=10143
PRIVATE_KEY=0x...
FINGERPRINT_REGISTRY_ADDRESS=0x...
REPUTATION_REGISTRY_ADDRESS=0x...
PROJECT_KEYS=axiom_pk_demo
MONAD_PRIORITY_FEE_GWEI=2
X402_PAY_TO_ADDRESS=0x...
X402_SUBMIT_FIX_PRICE=0.01
X402_VOTE_FIX_PRICE=0.005
```

## 2. Deploy Contracts

- [ ] Install Foundry if it is not installed locally.
- [ ] Build the contracts.
- [ ] Run the contract tests.
- [ ] Deploy the registry contract to Monad testnet.
- [ ] Copy the deployed address into backend env vars.
- [ ] Record the deployed address in your docs or release notes.

### Example commands

```bash
cd contracts
forge build
forge test
forge script script/Deploy.s.sol --broadcast
```

### What to capture after deploy

```text
FingerprintRegistry deployed address
ReputationRegistry deployed address
Tx hash for the deployment
Explorer link for the deployment
```

## 3. Apply Database Schema

- [ ] Apply the schema changes to a real database.
- [ ] Confirm the new `crash_map_points` table exists.
- [ ] Confirm the fingerprint columns were added.
- [ ] Confirm the fix `onchain_fix_id` column exists.

### Example SQL

```sql
\dt
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name IN ('fingerprints', 'fixes', 'crash_map_points')
ORDER BY table_name, ordinal_position;
```

## 4. Run Backend Against Real Services

- [ ] Activate a Python 3.11 virtualenv for the backend.
- [ ] Install backend requirements in that env.
- [ ] Start the API against the real Postgres and Redis services.
- [ ] Verify the API can load the ABI artifact and connect to Monad RPC.
- [ ] Confirm the relayer has a valid private key and registry address.

### Example commands

```bash
cd backend/api
python3.11 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Example health checks

```bash
curl http://localhost:8000/health
curl http://localhost:8000/v1/feed
curl http://localhost:8000/v1/map/crashes
```

## 5. Smoke Test Ingest

- [ ] Send a crash event to `POST /v1/ingest`.
- [ ] Confirm the backend returns a fingerprint hash.
- [ ] Confirm the response includes match count and location data.
- [ ] Confirm the backend writes the mirror only after a successful chain receipt.
- [ ] Confirm the dashboard feed updates.
- [ ] Confirm the crash map gets a new pulse.

### Example ingest payload

```bash
curl -X POST http://localhost:8000/v1/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "axiom_pk_demo",
    "service": "checkout-api",
    "environment": "production",
    "error_type": "RedisConnectionTimeout",
    "message": "Connection timed out after 5000ms",
    "stack": "Error: timeout",
    "language": "node20",
    "framework": "express",
    "runtime_region": "us-east-1"
  }'
```

### What to verify in the response

```json
{
  "status": "known_failure",
  "fingerprint_hash": "0x...",
  "match_count": 12,
  "monad_tx_hash": "0x...",
  "location": {
    "latitude": 40.7,
    "longitude": -74.0,
    "region": "US-East",
    "country": "US",
    "blast_radius": 42
  }
}
```

## 6. Smoke Test Fix Submit and Vote

- [ ] Obtain or simulate a valid x402 payment header.
- [ ] Submit a fix for a known fingerprint.
- [ ] Confirm the response contains an on-chain fix id and tx hash.
- [ ] Vote on the fix using the x402-gated route.
- [ ] Confirm the reputation and fix counts update.

### Example request headers

```bash
X-PAYMENT: payer=0xabc;proof=dev-paid
```

### Example submit call

```bash
curl -X POST http://localhost:8000/v1/fixes \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: payer=0xabc;proof=dev-paid" \
  -d '{
    "fingerprint_id": "00000000-0000-0000-0000-000000000000",
    "title": "Retry Redis connection with backoff",
    "description": "Retry the call with exponential backoff and cap the timeout."
  }'
```

### Example vote call

```bash
curl -X POST http://localhost:8000/v1/fixes/00000000-0000-0000-0000-000000000000/vote \
  -H "Content-Type: application/json" \
  -H "X-PAYMENT: payer=0xabc;proof=dev-paid" \
  -d '{ "successful": true }'
```

## 7. Frontend Manual QA

- [ ] Start the web app against the real API.
- [ ] Open the dashboard and confirm the feed loads.
- [ ] Open the crash map and confirm it renders tiles and markers.
- [ ] Confirm the popup shows the fingerprint hash, severity, match count, and Monad tx link.
- [ ] Confirm the unknown-region list appears when coordinates are missing.
- [ ] Confirm websocket updates refresh the feed and map without a page reload.

### Example command

```bash
npm run dev:web
```

## 8. Crash Reporter Integration

- [ ] Install `@axiom/crash-reporter` in the host app.
- [ ] Wire runtime hooks or middleware.
- [ ] Point it at the real API endpoint.
- [ ] Trigger a real crash or thrown error in the host app.
- [ ] Verify the ingest request reaches the backend.

### Example usage

```js
import { createCrashReporter } from "@axiom/crash-reporter";

const reporter = createCrashReporter({
  endpoint: "https://api.example.com/v1/ingest",
  projectKey: "axiom_pk_demo",
  service: "checkout-api",
  environment: "production"
});

reporter.installRuntimeHooks();
```

## 9. MCP Helper Integration

- [ ] Consume `@axiom/mcp` in the agent/client workflow.
- [ ] Verify `search_failure` returns relevant feed rows.
- [ ] Verify `get_fixes` returns fixes for a fingerprint.
- [ ] Verify `submit_fix` and `vote_fix` work with x402 headers.

### Example usage

```js
import { createAxiomMcpClient } from "@axiom/mcp";

const client = createAxiomMcpClient({
  apiUrl: "https://api.example.com/v1",
  paymentHeader: "payer=0xabc;proof=dev-paid"
});

const matches = await client.search_failure("RedisConnectionTimeout");
```

## 10. Optional Cleanup Before Shipping

- [ ] Decide whether to keep the temporary backend `.venv` locally only.
- [ ] Decide whether `package-lock.json` should be committed as the workspace lockfile.
- [ ] Decide whether to add browser-based map QA before merging.
- [ ] Decide whether to create migrations instead of relying on `create_all` for production.

## Definition of Done

- [ ] Contracts are deployed and addresses are recorded.
- [ ] Backend is running against live infra.
- [ ] `POST /v1/ingest` works end to end.
- [ ] Fix submit and vote work with x402 headers.
- [ ] Crash map updates in realtime.
- [ ] Frontend is visually verified in a browser.
- [ ] Reporter and MCP packages are integrated into a real host app.
