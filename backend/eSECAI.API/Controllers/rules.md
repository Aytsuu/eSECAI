# Controller Rules

## Structure
- Store API controllers here.
- Inherit from `ControllerBase`.
- Apply `[ApiController]` and `[Route("api/[controller]")]` or `[Route("api/[resource]")]` attributes.

## Naming
- Class names must be PascalCase and end with `Controller` (e.g., `AuthController`, `ClassroomController`).
- Methods should be HTTP verb-based or descriptive of the action (e.g., `Login`, `GetClassroom`).

## Dependencies
- Inject Use Cases (e.g., `CreateUserUseCase`) into the constructor.
- Avoid injecting Repositories directly; use the Use Case layer to encapsulate business logic.

## Implementation
- Use XML documentation (`/// <summary>`) for classes and methods to support Swagger/OpenAPI.
- Return `IActionResult` or `ActionResult<T>`.
- Keep controllers thin; delegate business logic to Use Cases.
- proper clean up to the code, remove unused resources.

## Validation
- Rely on model state validation provided by `[ApiController]` and Data Annotations/FluentValidation in DTOs.
