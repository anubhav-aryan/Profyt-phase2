<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## PROFYT UI

Match the phase 1 marketing app ([`profyt-nextjs`](file:///Users/anubhav/Desktop/profyt-nextjs)): warm neutrals and bronze scale in [`app/globals.css`](app/globals.css) (`black`, `off`, `pale`, `l1`–`l4`, etc.), **DM Serif Display** for display titles, **Instrument Sans** for body, **DM Mono** for labels and buttons. Prefer utilities `profyt-card`, `profyt-input`, `profyt-btn-primary`, `profyt-btn-secondary`, `profyt-link`, and [`ProfytWordmark`](components/ProfytWordmark.tsx) for branding.

**Dev portal demo (after `npm run db:seed`):** Client ID `demo-client`, user `demo-user`, password `profyt`. Seeded by [`prisma/seed.ts`](prisma/seed.ts).
