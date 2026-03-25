# DTO Rules

## Structure
- Store Data Transfer Objects here.
- Use C# `record` types for immutability and concise syntax where possible.

## Naming
- Class/Record names should describe the purpose (e.g., `LoginRequest`, `AuthResponse`).
- Use PascalCase for record names.

## Implementation
- Organize DTOs by feature or domain if the file count grows large, or group related DTOs in a single file (like `AuthDto.cs`) if they are small and tightly coupled.
- Properties should generally follow camelCase for JSON serialization compatibility (default in ASP.NET Core) or match the expected client-side contract.

## Usage
- Use DTOs for Controller parameters (Requests) and return types (Responses).
- Do not expose Entity classes directly in the API; always map to DTOs.
