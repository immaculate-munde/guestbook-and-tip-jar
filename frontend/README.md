# Guestbook frontend

Next.js UI for the guestbook dapp. See the [root README](../README.md) for setup, contract deploy, and Vercel.

```bash
npm run build:client   # from repo root, or npm run build:client in this folder
cp .env.example .env.local
npm run dev
```

On Vercel: Root Directory = `frontend`, add `NEXT_PUBLIC_*` env vars from the root README.

The live app includes an **FAQ** section (`#faq`); developer-focused Q&A is in the [root README](../README.md#faq).
