# Schema Rules

## Structure
- Store Zod schemas and validation logic here.
- Organize one file per domain or feature (e.g., `auth.schema.ts`, `user.schema.ts`).

## Naming
- Use kebab-case with `.schema.ts` suffix (e.g., `auth.schema.ts`).
- Exported variable names should be descriptive (e.g., `loginSchema`, `userProfileSchema`).

## Implementation
- Use Zod (`z`) for defining schemas.
- Use `z.infer<typeof schemaName>` for type inference when using TypeScript.
- Match schemas closely with backend DTOs or form structures.
- Use localized or clear error messages for validation failures.
- Prefer `.refine` for complex cross-field validations (e.g., password confirmation).

## Usage
- Import schemas into React Hook Form via `zodResolver` in components.
- Import schemas into services if client-side payload validation is needed before sending to API.
