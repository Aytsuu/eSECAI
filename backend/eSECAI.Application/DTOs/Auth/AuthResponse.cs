using eSECAI.Domain.Enums;

public record AuthResponse(
    string accessToken, 
    string refreshToken,
    Guid userId,
    string username,
    string email,
    string displayName,
    string displayImage,
    UserRole role
 );