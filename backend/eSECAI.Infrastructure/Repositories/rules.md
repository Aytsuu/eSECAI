# Repository Rules

## Structure
- Store data access logic here, implementing interfaces defined in the Application layer.
- Ensure the repository manages entity persistence and retrieval.
- Place implementations in `eSECAI.Infrastructure.Repositories`.

## Naming
- Class names should be `[Entity]Repository` suffix (e.g., `AuthRepository`, `ClassroomRepository`).
- Files should match the interface name (e.g., `AuthRepository.cs`).

## Dependencies
- Interface implementation is mandatory (e.g., `public class AuthRepository : IAuthRepository`).
- Inject `AppDbContext` (EF Core) or similar for database access.
- Use `ILogger` for logging database operations.

## Implementation
- Implement async methods (`Task<T>`, `Task`) for standard IO operations.
- Handle data mapping between database entities and domain entities if necessary (though usually they are the same or mapped by EF).
- Avoid business logic here; focus on CRUD operations and data retrieval/persistence logic only.
- Use `AsNoTracking()` for read-only queries to improve performance.
- Use explicit transaction management if complex multi-step database operations are required.
