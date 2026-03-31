
namespace esecai.Application.DTOs;

public record CreateEnrollmentDto(Guid classId);
public record PendingEnrollment(
  Guid classId,
  DateTime enrollAt,
  string className
);
public record UpdateEnrollmentStatusDto(string status);