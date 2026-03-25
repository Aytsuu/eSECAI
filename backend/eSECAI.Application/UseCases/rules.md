# Use Case Rules

## Structure
- Store application logic here, orchestrating interactions between the API, Domain, and Infrastructure.
- Organize Use Cases by domain/feature (e.g., `eSECAI.Application.UseCases.Auth`).
- Each Use Case should ideally handle a single specific business operation.

## Naming
- Class names should follow the `Verb[Entity]UseCase` pattern (e.g., `CreateUserUseCase`, `VerifyUserUseCase`).

## Dependencies
- Use Cases should depend on Repositories `I[Repository]` interfaces, not concrete implementations.
- Inject other services (e.g., `IEmailService`) as needed.

## Implementation
- Typically implement a method like `ExecuteAsync` or similar (e.g., `Handle`, `Process`).
- Maintain Separation of Concerns: Do not handle HTTP-specific concerns (status codes, JSON serialization) inside Use Cases. Return domain objects or DTOs and let the Controller handle the web layer.

## Validation
- Validate business rules within the Use Case.
