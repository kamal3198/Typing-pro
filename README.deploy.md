# Frontend Deployment (Vercel)

This project uses Vite and outputs a static `dist/` folder. The recommended and easiest deployment for the frontend is **Vercel**.

## Quick steps (Vercel UI - easiest)
1. Go to https://vercel.com and sign in with GitHub.
2. Click **Import Project** → choose the `Typing-pro` repo.
3. Set the Root Directory to `frontend` (important).
4. Set Build Command to `npm run build` and Output Directory to `dist`.
5. Create and deploy. Vercel will automatically build on push.

## Automated deploy via GitHub Actions (already added)
A GitHub Action is provided at `.github/workflows/frontend-vercel.yml`. It will:
- run `npm ci` and `npm run build` inside `frontend`, and
- deploy to Vercel using `amondnet/vercel-action`.

To enable the action, set the following repository secrets in GitHub:
- `VERCEL_TOKEN` — create a token in Vercel (Account Settings → Tokens)
- `VERCEL_ORG_ID` — from Vercel project settings
- `VERCEL_PROJECT_ID` — from Vercel project settings

After adding the secrets, pushes to `main` will trigger the workflow and deploy to Vercel.

## Backend notes
- The backend requires a MongoDB connection (`MONGO_URI`). For production use create an Atlas cluster (or host DB elsewhere) and set `MONGO_URI` on your backend host.
- Recommended backend hosts: Render, Railway, Fly, or a small VPS. If you prefer, I can add a deployment workflow for Render/Railway; you'll need to provide the respective API token or connect via the web UI.

## Local MONGO_URI (development)
You provided:
```
MONGO_URI=mongodb://localhost:27017/typingpro_db
```
That is fine for local dev. For production, replace with your Atlas URI.

---
If you'd like, I can:
- Finish wiring a GitHub Action for backend deploy (Render/Railway) and add instructions to store `MONGO_URI` as a deployment environment variable, or
- Help connect the repo to Vercel now and verify an initial deployment.

Tell me which option you prefer and I will proceed. 🔧
