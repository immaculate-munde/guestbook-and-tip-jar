# Decentralized Guestbook & Tip Jar

A Stellar Soroban guestbook with optional XLM tips, a generated TypeScript client, and a Next.js dashboard wired to **Freighter**.

## Stack

| Layer | Path | Tech |
|-------|------|------|
| Contract | `contracts/guestbook` | Rust / Soroban SDK |
| Client | `packages/guestbook_client` | `stellar contract bindings typescript` |
| Frontend | `frontend` | Next.js, Tailwind, Freighter |

## Prerequisites

- [Rust](https://rustup.rs/) + `wasm32v1-none` target
- [Stellar CLI](https://developers.stellar.org/docs/tools/developer-tools/cli/stellar-cli) (`stellar`)
- Node.js 20+
- [Freighter](https://www.freighter.app/) on **Testnet** with a funded account

## Quick start

```bash
# From repo root
npm install
npm run build:client

cd frontend
cp .env.example .env.local   # or use the output of npm run setup
npm run dev
```

Open **https://localhost:3000** in **Chrome or Firefox** (HTTPS is required for Freighter).

### HTTPS certificate error (`ERR_CERT_AUTHORITY_INVALID`)

Freighter needs HTTPS. On Linux, Chromium only trusts local dev certs after NSS tools are installed:

```bash
sudo apt install libnss3-tools mkcert
cd frontend
npm run setup:https   # installs local CA + regenerates certificates/
npm run dev
```

Then open **https://localhost:3000** in an external browser (not Cursor’s preview panel—its embedded Chromium often won’t pick up the trusted CA). After `mkcert -install`, restart the browser once.

### First-time deploy & env

From the repo root, with a funded CLI identity (default `mywallet`):

```bash
npm run setup
```

This builds the contract, deploys to testnet, regenerates bindings, and writes `frontend/.env.local`.

Manual deploy:

```bash
stellar contract build
stellar contract deploy \
  --wasm target/wasm32v1-none/release/guestbook.wasm \
  --source mywallet \
  --network testnet \
  -- \
  --admin mywallet \
  --tip_token $(stellar contract id asset --network testnet --asset native)
```

## Contract API

- `__constructor(admin, tip_token)` — set tip recipient and XLM SAC address
- `sign_guestbook(user, message, tip_amount)` — auth required; optional tip in stroops
- `get_messages()` — all messages in order

**Deployed testnet contract (example):** `CCFDP65OT63AUZVYBDWHZNHFG5CDB3YEYIIQAOVC2JIKUODY4D4GJZ7P`

## Development

```bash
# Build contract
npm run build:contract

# Regenerate TS client after contract changes
stellar contract bindings typescript \
  --wasm target/wasm32v1-none/release/guestbook.wasm \
  --output-dir packages/guestbook_client \
  --overwrite
npm run build:client

# Run frontend
npm run dev
```

## Tests

```bash
cargo test -p guestbook
```

## License

Apache-2.0 (Stellar contract template default)
