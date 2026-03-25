# Helper Rules

## Structure
- Store pure utility functions here.
- These functions should be free of side effects and not depend on React hooks or component state.
- Focus on data transformation, formatting, calculations, etc.

## Naming
- Use camelCase for filenames (e.g., `dateFormatter.ts`).
- Use descriptive function names.

## Implementation
- Exports should be named exports (e.g., `export const formatDate = ...`).
- Prefer pure functions; avoid modifying global variables or external state.
- Include JSDoc comments for complex or non-trivial functions.
- Consider moving helpers specific to a single component or feature into that component's file or folder, keeping this folder for truly global utilities.

## Testing
- Helper functions are prime candidates for unit testing due to their pure nature.
