# Control Room — Neo OS

Premium tailnet-only operations dashboard. Built on Next.js 16, shadcn/ui v4 (Base UI), Radix primitives, Recharts, and kbar.

## Stack
- **Framework**: Next.js 16.2.2 (App Router, Turbopack)
- **UI**: shadcn/ui v4 (Base UI) + Radix UI primitives
- **Icons**: @tabler/icons-react
- **Charts**: Recharts
- **Command palette**: kbar
- **Theme**: next-themes (dark-only, no system toggle)
- **Styling**: Tailwind CSS v4, CSS variables, oklch color space
- **Auth**: None — tailnet-only access via Vercel deployment

## Key Patterns

### Sidebar navigation
Uses `SidebarMenuButton` with `tooltip` prop for collapsed-state labels. Nav config: `src/config/nav-config.ts`. Shortcut keys work via kbar.

### Charts
`ChartContainer` + typed Recharts components. `ChartConfig` drives CSS variables for theme-aware colors. `chart.tsx` in `src/components/ui/` — uses `unknown` payload types to avoid recharts version conflicts.

### Kbar (Cmd+K)
`src/components/kbar/index.tsx` — wraps nav-config actions. No RBAC (tailnet-only). `src/hooks/use-nav.ts` — simplified, no Clerk deps.

### Theming
`src/components/themes/` — `theme-mode-toggle.tsx` uses native button + next-themes. ThemeProvider wraps app in `src/app/layout.tsx`.

## Build
```
npm run build   # TypeScript check + production build
npm run dev     # Dev server with Turbopack
```

## Gotchas
- SidebarMenuButton uses `children` not `render` prop (Base UI useRender pattern stripped)
- Radix TooltipTrigger supports `asChild`
- Separator and Label use direct @radix-ui imports, not bare `radix-ui`
- pie-graph formatter uses `unknown` to avoid Recharts LabelFormatter type conflicts
