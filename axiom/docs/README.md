# Axiom

Axiom is a full-stack Monad application with two product features: a global failure intelligence feed and a verified fix reputation system.

## Run Locally

```bash
cp .env.example .env
docker compose up
```

## Backend

```bash
cd backend/api
pip install -r requirements.txt
python -m pytest
uvicorn app.main:app --reload
```

## Frontend

```bash
npm install
npm run dev:web
```

## Contracts

```bash
cd contracts
npm install
npm run compile
npm run deploy -- --network monadTestnet
```
