# PROJECT KNOWLEDGE BASE

**Generated:** 2026-01-15
**Commit:** 412c1c2
**Branch:** main

## OVERVIEW

Next.js 14 App Router platform for AI consultation services (Donjon Intelligence Systems). Stack Auth + Neon PostgreSQL. Dark glassmorphism design system ("Donjon").

## STRUCTURE

```
curve_ai_solutions_app/
├── app/                    # Next.js App Router pages + API routes
│   └── actions/            # Server actions (heavy - see AGENTS.md there)
├── components/             # React components (see AGENTS.md there)
│   ├── ui/                 # Shadcn/ui primitives
│   ├── admin/              # Admin dashboard components
│   └── donjon/             # NEW: Glassmorphism design system
├── lib/                    # Core utilities (see AGENTS.md there)
├── providers/              # React context providers (Stack Auth)
├── stack/                  # Stack Auth client/server init
├── alfie-agent/            # AI agent documentation/PDFs
├── prompts/                # AI prompt templates (JSON)
├── n8n-workflows/          # N8N workflow exports
└── supabase/               # DB migrations (legacy naming)
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Auth flow | `lib/stack-auth-*.ts`, `providers/stack-auth-provider.tsx` | NOT Supabase despite CLAUDE.md |
| Database ops | `lib/db*.ts` | Neon PostgreSQL, not Supabase |
| Server actions | `app/actions/` | Heavy files - see subdir AGENTS.md |
| Design system | `components/donjon/`, `app/globals.css` | Glass effects, sky-400 accents |
| Admin routes | `app/admin/` | Uses Stack Auth permissions |
| Landing page | `app/page.tsx` | Recently redesigned |

## CONVENTIONS

**Auth**: Stack Auth (not Supabase). Check `isUserAdmin()` via permissions, not roles. Configure 'admin' permission in Stack dashboard.

**Database**: Neon PostgreSQL via `DATABASE_URL`. Server actions use `sql` from `lib/db.ts`. No ORM.

**Design System** (Donjon):
- Dark default: `bg-[#030712]`, `text-slate-50`
- Accents: `sky-400`, `sky-500` (replaced donjon-indigo in UI)
- Glass: `glass-panel` class (backdrop-blur + border-white/10)
- Labels: `fira-label` (mono text-xs tracking-wider)
- Tags: `tech-tag tech-tag-{color}` (sky/emerald/indigo/violet/pink/amber)

**Fonts**: Outfit (sans) + Fira Code (mono) via CSS variables `--font-outfit`, `--font-fira-code`.

**Server Actions**: `"use server"` directive, Zod validation, `revalidatePath()` for cache.

## ANTI-PATTERNS (THIS PROJECT)

- **NEVER** use Supabase auth functions - they throw/redirect to Stack Auth
- **NEVER** import from deprecated files: `middleware-old-UNSAFE.ts`, `*-old.ts`
- **NEVER** suppress build errors with `ignoreBuildErrors` (currently set - technical debt)
- **AVOID** adding to 500+ line files - refactor first (see complexity hotspots below)

## COMPLEXITY HOTSPOTS

Files >500 lines needing refactoring:
- `app/actions/assessment-actions.ts` (1143 lines) - split into modules
- `app/solutions/page.tsx` (894 lines) - extract data + componentize
- `app/actions/tool-actions.ts` (801 lines) - extract CRUD utilities
- `components/ui/sidebar.tsx` (763 lines) - shadcn complexity

## LEGACY/DEPRECATED

| File | Status | Notes |
|------|--------|-------|
| `lib/supabase-*.ts` | Deprecated | Throws errors, redirects to Stack |
| `middleware-old-UNSAFE.ts` | Remove | Security risk |
| `middleware-broken.ts.bak` | Remove | Backup artifact |
| `*-old.ts`, `*-old-backup.tsx` | Remove | Version control through files |

## COMMANDS

```bash
pnpm dev          # Dev server (localhost:3000)
pnpm build        # Production build
pnpm lint         # ESLint
pnpm start        # Production server
```

## NOTES

- **No tests**: Zero test framework/coverage. RLS test panel is UI component, not automated tests.
- **Build errors suppressed**: `next.config.mjs` has `ignoreBuildErrors: true` - hides real issues.
- **Middleware gap**: Current middleware doesn't protect admin routes - security concern.
- **Doc drift**: CLAUDE.md says Supabase Auth but code uses Stack Auth. Trust code.
- **Design transition**: Site migrating to Donjon dark theme. Secondary pages still have old styling.
