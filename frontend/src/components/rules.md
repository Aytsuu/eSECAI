# Component Rules

## Structure
- Organize components by their scope:
  - `ui/`: Generic, reusable UI components (buttons, inputs, cards). These should be dumb components.
  - `compositions/`: Complex components composed of multiple UI elements or other compositions.
  - `context/`: React Context providers.
  - `route/`: Page-specific components that are not reused elsewhere.
  - `wrapper/`: Higher-order components or layout wrappers.

## Naming
- Use PascalCase for component filenames and function names (e.g., `MyComponent.tsx`).

## Implementation
- Prefer functional components with named exports.
- Use interface for Props definition.
- Deconstruct props in the function signature.
- Use `cn()` utility from `src/lib/utils` for conditional class merging with Tailwind.

## Best Practices
- Keep components small and focused on a single responsibility.
- Extract complex logic into custom hooks in `src/hooks`.
- Avoid hardcoding strings; usage of constants or localization is preferred (if applicable).
