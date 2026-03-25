# Service Implementation Rules

## Structure
- Store infrastructure service implementations here (e.g., email, file storage, cache, 3rd party integrations).
- Implement interfaces defined in `eSECAI.Application.Interfaces`.

## Naming
- Class names must end with `Service` (e.g., `EmailService`, `RedisCacheService`, `MinioFileService`).
- Files should match the class name.

## Dependencies
- Implement the corresponding interface from the Application layer.
- Inject `IConfiguration` for accessing settings (connection strings, API keys).
- Inject `ILogger` for logging service operations.

## Implementation
- Encapsulate external system interactions (e.g., SMTP, S3/MinIO, Redis).
- Do not contain core business logic; focus on the "how" of the technical implementation. The "what" and "when" should be driven by the Application layer.
- Handle external exceptions and wrap them in domain/application exceptions if needed, or let them bubble up if they are critical infrastructure failures.
- Make methods `async` where IO operations are involved.

## Configuration
- Use the `appsettings.json` via `IConfiguration` to retrieve service-specific settings (e.g., `Email:SmtpServer`, `Minio:Endpoint`).
- Prefer strongly typed options pattern if the configuration is complex (optional but recommended for scalability).
