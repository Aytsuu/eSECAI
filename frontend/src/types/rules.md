# Type Definition Rules

## Structure
- Store global type definitions, interfaces, and enums here.
- Focus on defining the shape of data used across the application (DTOs, component props if shared, state structures).

## Naming
- Use kebab-case with appropriate extension (`.d.ts` for declarations, `.ts` for types/interfaces).
- Interface names: PascalCase, typically prefixed with `I` (e.g., `IUser`) or suffix with `Dto` (e.g., `UserDto`) depending on team convention. Based on existing files, simple PascalCase seems preferred (e.g., `UserProfile`).
- Type aliases: PascalCase.

## Content
- Prioritize `interface` for object shapes, `type` for unions/intersections/aliases.
- Avoid using `any`; be as specific as possible.
- Use generics where appropriate for reusable types.
- Ensure types match backend API responses (DTOs).

## Usage
- Import types into components, services, and hooks.
- Use `export type` or `export interface`.
