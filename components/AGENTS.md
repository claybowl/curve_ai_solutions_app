# COMPONENTS

React component library. Shadcn/ui primitives + custom components + Donjon design system.

## STRUCTURE

```
components/
├── ui/              # 51 files - Shadcn/ui primitives (DO NOT MODIFY)
├── admin/           # 20 files - Admin dashboard widgets
├── admin-dashboard/ # 4 files  - Management tables (overlap with admin/)
├── donjon/          # 4 files  - NEW glassmorphism design system
├── auth/            # 2 files  - Login form, password utilities
└── *.tsx            # ~40 files - General site components
```

## WHERE TO LOOK

| Task | Location | Notes |
|------|----------|-------|
| Form controls | `ui/input.tsx`, `ui/button.tsx`, `ui/select.tsx` | Use `cn()` for className |
| Layout shells | `admin/dashboard-layout.tsx`, `admin/admin-sidebar.tsx` | Stack Auth integrated |
| Data tables | `admin-dashboard/*-table.tsx` | User/assessment/consultation |
| Glass effects | `donjon/glass-card.tsx` | Wraps content in glass-panel |
| Backgrounds | `donjon/synapse-background.tsx`, `sky-background.tsx` | Ambient glow effects |
| Navigation | `main-nav.tsx`, `navbar.tsx`, `footer.tsx` | Site-wide nav |
| Forms | `assessment-form.tsx`, `consultation-form.tsx` | Client-facing forms |

## CONVENTIONS

**Props Pattern:**
```tsx
interface ComponentProps {
  children?: ReactNode;
  className?: string;  // Always optional, merge with cn()
}
```

**Form Controls:** Use `React.forwardRef` + `displayName` for ref forwarding.

**Shadcn/ui:** Import from `@/components/ui/*`. Use `cn()` from `@/lib/utils` for class merging.

**Donjon Classes:** `glass-panel`, `data-card`, `fira-label`, `neon-line`, `tech-tag-{sky|emerald|indigo|violet|pink|amber}`

**Client Components:** Add `"use client"` only when using hooks, router, or browser APIs.

## ANTI-PATTERNS

- **NEVER** modify `ui/` files directly - shadcn/ui managed
- **NEVER** duplicate admin/ vs admin-dashboard/ - consolidate to admin/
- **NEVER** use inline styles for Donjon theming - use CSS classes
- **AVOID** prop drilling - use context for deep component trees
- **AVOID** adding to sidebar.tsx (763 lines) - extract sub-components
