# Hook Rules

## Structure
- Store custom React hooks here.
- Focus on extracting repetitive logic, state management, or complex side effects from components.

## Naming
- Use `use-` prefix for filenames (kebab-case, e.g., `use-auth.ts`).
- Use `use` prefix for hook names (camelCase, e.g., `useAuth`).

## Implementation
- Follow the Rules of Hooks (only call at the top level, only call from React functions).
- Use `useCallback` and `useMemo` appropriately to prevent unnecessary re-renders.
- Return consistent object/array structures from hooks.
- Handle loading and error states within data fetching hooks (e.g., wrap React Query calls).

## Dependencies
- Be explicit with dependency arrays in `useEffect`, `useCallback`, and `useMemo`.
