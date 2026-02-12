# AGENT CODING GUIDE

**Stack:** Next.js 15.5.7, TypeScript, Supabase Auth, Neon PostgreSQL, Tailwind CSS, shadcn/ui

---

## COMMANDS

```bash
npm run dev          # Dev server (localhost:3000) with 8GB heap
npm run build        # Production build (errors suppressed - see below)
npm run start        # Production server
npm run lint         # ESLint
npm run sync-stripe  # Sync Stripe products
```

**Testing:** No test framework configured. Zero automated tests.

---

## CODE STYLE

### Import Order
```typescript
// 1. React/Next
import { useState } from "react"

// 2. Third-party
import { z } from "zod"

// 3. Internal utilities (@/*)
import { cn } from "@/lib/utils"
import { sql } from "@/lib/db"

// 4. Components (@/*)
import { Button } from "@/components/ui/button"

// 5. Types (use "import type")
import type { UserProfile } from "@/types/users"
```

### Naming
- **Files:** `kebab-case.tsx` (components), `*-actions.ts` (server actions)
- **Components:** `PascalCase` (e.g., `UserCard`)
- **Functions:** `camelCase`, verb prefix for actions (e.g., `getUserProfile`)
- **Constants:** `UPPER_SNAKE_CASE`

### TypeScript
- Use `interface` for object shapes, `type` for unions
- Separate type imports: `import type { X } from "..."`
- Props interface always named `ComponentNameProps`
- Always include optional `className?: string`, merge with `cn()`

---

## SERVER ACTIONS PATTERN

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { requireAdmin } from "@/lib/supabase-server"
import { sql } from "@/lib/db"

const schema = z.object({ name: z.string().min(1) })

export async function createItem(data: FormData | Record<string, unknown>) {
  try {
    const user = await requireAdmin()
    if (!user) return { success: false, error: "Unauthorized" }

    const validated = schema.parse(
      data instanceof FormData ? Object.fromEntries(data) : data
    )

    const result = await sql.query(
      `INSERT INTO items (name) VALUES ($1) RETURNING *`,
      [validated.name]
    )

    revalidatePath('/admin/items')
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("createItem error:", error)
    return { success: false, error: error instanceof Error ? error.message : "Failed" }
  }
}
```

**Rules:**
- Always return `{ success: boolean, data?: T, error?: string }`
- NEVER throw to client - catch all errors
- Use parameterized queries only (`sql.query(query, params)`)
- NEVER use `redirect()` inside try/catch (it throws internally)

---

## COMPONENT PATTERN

```typescript
"use client" // Only if using hooks/router/browser APIs

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MyComponentProps {
  title: string
  className?: string
}

export function MyComponent({ title, className }: MyComponentProps) {
  const [state, setState] = useState(false)
  return (
    <div className={cn("glass-panel p-6", className)}>
      <h2>{title}</h2>
    </div>
  )
}
```

---

## PROJECT STRUCTURE

```
app/
  actions/          # Server actions (see app/actions/AGENTS.md)
  admin/            # Admin dashboard pages
  api/              # API routes (minimal - prefer server actions)
components/
  ui/               # shadcn/ui primitives (DO NOT MODIFY)
  admin/            # Admin components
  donjon/           # Donjon design system
lib/                # Utilities (see lib/AGENTS.md)
types/              # TypeScript definitions
```

---

## DESIGN SYSTEM

**CSS Classes:**
- `glass-panel` - Frosted glass card
- `glass-panel-solid` - Less transparency
- `data-card` - Interactive card with hover
- `fira-label` - Monospace tech labels
- `tech-tag-{sky|emerald|indigo|violet|pink|amber}` - Colored tags

**Colors:**
- Background: `bg-[#030712]`, `bg-slate-900`
- Text: `text-slate-50`, `text-slate-400`
- Accents: `sky-400`, `sky-500`, `emerald-400`
- Borders: `border-white/10`, `border-sky-500/30`

---

## QUICK REFERENCE

**Auth (Server):**
```typescript
import { getCurrentUserServer, requireAdmin, isUserAdmin } from "@/lib/supabase-server"
```

**Auth (Client):**
```typescript
import { signInWithEmail, signOut, signUpWithEmail } from "@/lib/supabase-client"
```

**Database:**
```typescript
import { sql } from "@/lib/db"
const result = await sql.query(`SELECT * FROM users WHERE id = $1`, [id])
```

**Utils:**
```typescript
import { cn } from "@/lib/utils"  // Tailwind class merge
```

---

## ANTI-PATTERNS (BLOCKING)

**NEVER:**
- Import from `*-old.ts`, `*-old-backup.tsx`, `middleware-old-UNSAFE.ts`
- Suppress type errors with `as any`, `@ts-ignore`, `@ts-expect-error`
- Modify files in `components/ui/` (shadcn-managed)
- Use inline SQL without parameters
- Throw errors from server actions to client
- Use `redirect()` inside try/catch
- Import from `db-v2.ts` (deprecated)
- Use `getCurrentSupabaseUser()` (legacy)

**AVOID:**
- Adding to files >500 lines without refactoring
- Duplicating admin components between `admin/` and `admin-dashboard/`

---

## KNOWN ISSUES

- Build errors suppressed (`ignoreBuildErrors: true` in `next.config.mjs`)
- No automated tests
- Files needing refactoring: `assessment-actions.ts` (1143L), `tool-actions.ts` (801L), `sidebar.tsx` (763L)

---

**See also:** `app/actions/AGENTS.md`, `components/AGENTS.md`, `lib/AGENTS.md`
