# lib/ - Core Utilities

Server-side utilities for database, auth, email, and external integrations.

## WHERE TO LOOK

| Task | File | Notes |
|------|------|-------|
| Database connection | `db.ts` | Neon client, lazy init, `executeQuery()` |
| User CRUD | `db-users.ts` | Neon-based, bcrypt passwords |
| Tools CRUD | `db-tools.ts` | Categories, recommendations |
| Prompts CRUD | `db-prompts.ts` | Tags, user saves |
| Permissions/Roles | `db-permissions.ts` | Role-permission matrix, overrides |
| Admin stats | `db-stats.ts` | Dashboard aggregations |
| Client auth | `stack-auth-client.ts` | `signInWithEmail()`, OAuth |
| Server auth | `stack-auth-server.ts` | `isUserAdmin()`, `requireAuth()` |
| Admin user mgmt | `stack-auth-admin.ts` | CRUD users, permissions |
| Email notifications | `email.ts` | Resend/SendGrid, HTML templates |
| N8N integration | `n8n-client.ts` | Webhook triggers, execution status |
| Prompt files | `prompt-loader.ts` | Load JSON from `/prompts` dir |
| Classnames | `utils.ts` | `cn()` = clsx + tailwind-merge |
| Preview fallback | `db-safe.ts` | `safeQuery()` with fallback data |

## CONVENTIONS

- **Neon queries**: Use `sql.query(query, params)` - parameterized only
- **Auth checks**: `isUserAdmin()` checks Stack Auth permissions array
- **Error handling**: Try-catch in all db functions, log + rethrow
- **Transactions**: `await sql\`BEGIN\``, `COMMIT`, `ROLLBACK` (db-permissions)
- **Type imports**: `import type { X } from '@/types/*'` - separate type files

## ANTI-PATTERNS

**NEVER import from:**
- `supabase-client.ts` - Mock that redirects to Stack Auth
- `supabase-server.ts` - Throws errors, use `stack-auth-server.ts`
- `db-v2.ts` - Deprecated Supabase wrapper
- `db-tools-v2.ts` - Uses deprecated Supabase client
- `db-business.ts` - Stub, not implemented

**Migration flags:**
- `*-v2.ts` files = incomplete migrations, avoid for new code
- `db-safe.ts` = preview env only, not for production logic

## EXPORTS QUICK REF

```typescript
// Database
import { sql, executeQuery, getSql } from '@/lib/db'

// Auth (server)
import { isUserAdmin, requireAuth, requireAdmin } from '@/lib/stack-auth-server'

// Auth (client) 
import { signInWithEmail, signOut } from '@/lib/stack-auth-client'

// Utils
import { cn } from '@/lib/utils'
```
