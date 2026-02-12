## 2026-01-27 17:23:30 Issue: delegate_task unauthorized
- delegate_task calls for execution tasks failed with: Failed to create session: Unauthorized.
- This blocks delegating code changes for Task 1 (DB migration) and Task 3 (E2B scaffolding).
- Need tool authorization / access to delegate_task for execution.

## 2026-02-09 Issue: Dev server served 404 for critical Next assets (unstyled pages)
- Symptom: Dashboard appeared unstyled (default browser styles).
- Root cause: `npm run dev` used `dev-server.js` (custom server). Under that server, these endpoints returned **404**, so Tailwind CSS + runtime chunks never loaded:
  - `/_next/static/css/app/layout.css?v=...`
  - `/_next/static/chunks/main-app.js?v=...`
- Fix: switched dev script to run `next dev` directly via Next's CLI entrypoint.
- Additional fix: removed `next/dynamic` + `ssr:false` from `components/main-nav-wrapper.tsx` (it triggered `BAILOUT_TO_CLIENT_SIDE_RENDERING: next/dynamic` in HTML).
