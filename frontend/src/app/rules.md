# App Router Rules

## Structure
- Use the Next.js App Router file conventions (`layout.tsx`, `page.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`).
- Group routes logically using route groups `(group-name)` when they share a layout or need organizational separation without affecting the URL path.
- Keep the `app` directory focused on routing and layout logic. Move complex business logic and heavy UI components to `src/components`, `src/features` (if implemented), or `src/hooks`.

## Data Fetching
- Prefer Server Components for initial data fetching where possible.
- Use `loading.tsx` for suspense boundaries.
- For client-side data fetching, use React Query (TanStack Query) hooks provided in `src/hooks` or `src/services`.

## Metadata
- Define metadata in `layout.tsx` or `page.tsx` using the Metadata API for SEO.

## Client vs Server Components
- Use `"use client"` directive at the top of files only when necessary (e.g., usage of hooks, event listeners, browser-only APIs).
- Keep Server Components as the default.
