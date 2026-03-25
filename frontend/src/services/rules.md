# Service Rules

## Structure
- Store API integration logic, data fetching functions, and external system interactions here.
- Create service files per feature domain (e.g., `auth.service.ts`, `classroom.service.ts`).
- `api.service.ts` or `index.ts` usually configures the base HTTP client (Axios, Fetch wrapper).

## Naming
- Use kebab-case with `.service.ts` suffix.
- Export objects or class instances encapsulating related methods (e.g., `AuthService`).

## Implementation
- Use strict typing for function arguments and return types (leverage `src/types` DTOs).
- Encapsulate error handling logic within services (transform API errors into application errors).
- Methods should correspond to backend endpoints or logical operations.
- Prefer `async/await` for asynchronous operations.
- Avoid placing React-specific logic (hooks, components) inside service files; keep them pure JS/TS modules.
- Use `axios` intercepts for authentication tokens or global error handling if configured in `api.service.ts`.

## Usage
- Import services into custom hooks or directly into components (if using simple `useEffect` fetching, though hooks are preferred).
