
namespace eSECAI.Application.DTOs;

/// <summary>
/// Classroom
/// Everything should be in JS naming convention
/// </summary>
public record UserData(
  Guid userId,
  string email,
  string displayName,
  string displayImage
);

public record ClassroomDataResponse(
    Guid classId, 
    string className, 
    string classDescription, 
    string classBanner,
    DateTime classCreatedAt,
    UserData? creator
);

public record CreateClassroomRequest(
    Guid userId,
    string? name,
    string? description,
    Stream? bannerStream,
    string? contentType,
    string? fileName
);

public record UpdateClassroomRequest(
    Guid classId,
    string? name,
    string? description,
    Stream? bannerStream,
    string? contentType,
    string? fileName
);