# Entity Rules

## Structure
- Store domain entities here.
- These classes represent the core business objects and state.

## Naming
- Class names should be singular PascalCase (e.g., `User`, `Classroom`, `Enrollment`).

## Implementation
- Properties naming convention: The existing codebase uses `snake_case` for properties (e.g., `user_id`, `display_name`). Follow this convention for consistency, although PascalCase is standard C#.
- Include factory methods or constructors that enforce valid state upon creation.
- Define navigation properties as `virtual` (if lazy loading is desired) or `ICollection<T>` for relationships.
- Use data annotations (if needed) or Fluent API configurations in Infrastructure for database mapping details.
- Domain logic/methods (e.g., validation rules that update internal state) can be placed here to follow Rich Domain Model principles where appropriate.

## Dependencies
- Minimize external dependencies; entities should be POCOs (Plain Old CLR Objects) as much as possible, depending only on other domain entities or value objects.
