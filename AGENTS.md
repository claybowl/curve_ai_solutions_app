# AGENT CODING GUIDE

**For:** AI coding agents operating in this repository  
**Updated:** 2026-01-24  
**Stack:** Next.js 14 App Router, Supabase Auth, Neon PostgreSQL, Tailwind CSS

---

## COMMANDS

```bash
# Development
pnpm dev          # Dev server (localhost:3000) - custom dev-server.js with 8GB heap
pnpm build        # Production build (NOTE: build errors suppressed - see KNOWN ISSUES)
pnpm start        # Production server
pnpm lint         # ESLint (NOTE: lint errors suppressed during builds)

# Utilities
pnpm sync-stripe  # Sync Stripe products (scripts/sync-stripe-products.js)
```

**Testing:** No test framework configured. Zero automated tests.

---

## CODE STYLE CONVENTIONS

### Import Order

```typescript
// 1. React/Next.js core (if needed)
import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

// 2. Third-party libraries
import { z } from "zod"

// 3. Internal utilities/libs (@ alias)
import { getCurrentUserServer, requireAdmin } from "@/lib/supabase-server"
import { sql } from "@/lib/db"
import { cn } from "@/lib/utils"

// 4. Components (@ alias)
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

// 5. Types (use "import type" for type-only imports)
import type { UserProfile, UserSummary } from "@/types/users"
```

### TypeScript Conventions

**Interfaces vs Types:**
- Use `interface` for object shapes (default pattern in codebase)
- Use `type` for unions, intersections, primitives

**Type Imports:**
```typescript
// ✅ Correct - separate type imports
import type { UserProfile } from "@/types/users"

// ❌ Avoid - mixed imports
import { UserProfile } from "@/types/users"
```

**Props Typing:**
```typescript
// Components - use interface
interface ComponentNameProps {
  children?: ReactNode
  className?: string  // Always optional, merge with cn()
  onSubmit?: (data: FormData) => void
}

// Server actions - use Zod schemas + infer
const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2)
})
type UserInput = z.infer<typeof userSchema>
```

### Naming Conventions

**Files:**
- Components: `kebab-case.tsx` (e.g., `assessment-form.tsx`)
- Server actions: `*-actions.ts` (e.g., `user-actions.ts`)
- Utilities: `kebab-case.ts` (e.g., `supabase-server.ts`)
- Types: `kebab-case.ts` in `/types` (e.g., `users.ts`)

**Functions:**
- Components: `PascalCase` (e.g., `AssessmentForm`)
- Server actions: `camelCase` with verb prefix (e.g., `getUserProfile`, `createAssessment`)
- Utilities: `camelCase` (e.g., `getCurrentUserServer`, `executeQuery`)

**Variables:**
- `camelCase` for variables (e.g., `userId`, `isSubmitting`)
- `UPPER_SNAKE_CASE` for constants (e.g., `ADMIN_EMAIL_ALLOWLIST`)

### Server Actions Pattern (MANDATORY)

```typescript
"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUserServer, requireAdmin } from "@/lib/supabase-server"
import { sql } from "@/lib/db"

// 1. Define Zod schema at top
const inputSchema = z.object({
  field: z.string().min(1)
})

// 2. Action function with validation + auth + db + revalidate
export async function myServerAction(data: FormData | Record<string, unknown>) {
  try {
    // Auth check
    const user = await requireAdmin()
    if (!user) {
      return { success: false, error: "Unauthorized" }
    }

    // Validate input
    const validated = inputSchema.parse(
      data instanceof FormData ? Object.fromEntries(data) : data
    )

    // Database operation
    const result = await sql.query(
      `INSERT INTO table (field) VALUES ($1) RETURNING *`,
      [validated.field]
    )

    // Revalidate paths
    revalidatePath('/admin/path')
    
    return { success: true, data: result.rows[0] }
  } catch (error) {
    console.error("Error in myServerAction:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    }
  }
}
```

**Key Rules:**
- Always return `{ success: boolean, data?: T, error?: string }`
- NEVER throw to client - catch all errors
- Call `revalidatePath()` after mutations
- Use parameterized queries only: `sql.query(query, params)`

### Component Pattern

```typescript
"use client" // Only if using hooks/router/browser APIs

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MyComponentProps {
  title: string
  onAction?: () => void
  className?: string
}

export function MyComponent({ title, onAction, className }: MyComponentProps) {
  const [state, setState] = useState(false)

  return (
    <div className={cn("glass-panel p-6", className)}>
      <h2>{title}</h2>
      <Button onClick={onAction}>Action</Button>
    </div>
  )
}

// Export as default if page component
// export default MyComponent
```

### Error Handling

**Server Actions:**
```typescript
try {
  // operation
  return { success: true, data }
} catch (error) {
  console.error("Context:", error)
  return { success: false, error: "User-friendly message" }
}
```

**Client Components:**
```typescript
try {
  const result = await serverAction(data)
  if (!result.success) {
    toast.error(result.error)
    return
  }
  // Success path
} catch (error) {
  console.error("Unexpected error:", error)
  toast.error("Something went wrong")
}
```

### Database Queries

```typescript
import { sql } from "@/lib/db"

// ✅ Correct - parameterized
const result = await sql.query(
  `SELECT * FROM users WHERE email = $1`,
  [email]
)

// ❌ NEVER - SQL injection risk
const result = await sql.query(
  `SELECT * FROM users WHERE email = '${email}'`
)
```

### Donjon Design System

**CSS Classes (use these, don't reinvent):**
- `glass-panel` - Frosted glass card with backdrop blur
- `glass-panel-solid` - Solid glass with less transparency
- `data-card` - Interactive card with hover lift effect
- `fira-label` - Monospace tech labels (font-mono text-xs)
- `neon-line` - Glowing divider line
- `tech-tag tech-tag-{sky|emerald|indigo|violet|pink|amber}` - Colored tags

**Colors:**
- Background: `bg-[#030712]`, `bg-slate-900`
- Text: `text-slate-50`, `text-slate-400`
- Accents: `sky-400`, `sky-500` (primary), `emerald-400` (success)
- Borders: `border-white/10`, `border-sky-500/30`

---

## PROJECT STRUCTURE

```
curve_ai_solutions_app/
├── app/                    # Next.js App Router
│   ├── actions/            # Server actions (see app/actions/AGENTS.md)
│   ├── admin/              # Admin dashboard pages
│   └── api/                # API routes (minimal - prefer server actions)
├── components/             # React components (see components/AGENTS.md)
│   ├── ui/                 # Shadcn/ui primitives (DO NOT MODIFY)
│   ├── admin/              # Admin-specific components
│   └── donjon/             # Donjon design system components
├── lib/                    # Core utilities (see lib/AGENTS.md)
├── types/                  # TypeScript type definitions
├── providers/              # React context providers (Supabase Auth)
├── public/                 # Static assets
└── supabase/               # DB migrations
```

---

## ANTI-PATTERNS (BLOCKING VIOLATIONS)

**NEVER:**
- Import from `*-old.ts`, `*-old-backup.tsx`, `middleware-old-UNSAFE.ts`
- Suppress type errors with `as any`, `@ts-ignore`, `@ts-expect-error`
- Modify files in `components/ui/` (Shadcn-managed)
- Use inline SQL without parameters
- Throw errors from server actions to client
- Use `redirect()` inside try/catch (it throws internally)
- Add code to files >500 lines without refactoring first

**AVOID:**
- Importing from `db-v2.ts` (deprecated Supabase wrapper)
- Using `getCurrentSupabaseUser()` (legacy - use `getCurrentUserServer()`)
- Duplicating admin components between `admin/` and `admin-dashboard/`

---

## KNOWN ISSUES

⚠️ **Build errors suppressed** - `next.config.mjs` has `ignoreBuildErrors: true`  
⚠️ **No automated tests** - Zero test coverage, no test framework  
⚠️ **Middleware incomplete** - Admin routes not fully protected  
⚠️ **Complexity hotspots** - See files needing refactoring below

**Files >500 lines (refactor before adding):**
- `app/actions/assessment-actions.ts` (1143 lines)
- `app/solutions/page.tsx` (894 lines)
- `app/actions/tool-actions.ts` (801 lines)
- `components/ui/sidebar.tsx` (763 lines)

---

## QUICK REFERENCE

**Auth:**
```typescript
// Server-side
import { getCurrentUserServer, requireAdmin, isUserAdmin } from "@/lib/supabase-server"
const user = await getCurrentUserServer()
const admin = await requireAdmin()
const isAdmin = await isUserAdmin()

// Client-side
import { signInWithEmail, signOut, signUpWithEmail } from "@/lib/supabase-client"
```

**Database:**
```typescript
import { sql, executeQuery } from "@/lib/db"
const result = await sql.query(`SELECT * FROM table WHERE id = $1`, [id])
```

**Utils:**
```typescript
import { cn } from "@/lib/utils"  // Tailwind class merge
const className = cn("base-class", conditionalClass && "conditional", props.className)
```

---

**For detailed conventions in subdirectories, see:**
- `app/actions/AGENTS.md` - Server actions patterns
- `components/AGENTS.md` - Component conventions
- `lib/AGENTS.md` - Utility exports
