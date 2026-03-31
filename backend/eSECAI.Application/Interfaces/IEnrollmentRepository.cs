
using esecai.Domain.Entities;

namespace esecai.Application.Interfaces;

public interface IEnrollmentRepository
{
    Task<Enrollment> CreateEnrollmentAsync(Enrollment enrollment);
    Task<Enrollment> GetEnrollmentAsync(Guid classId, Guid userId);
    Task<IEnumerable<Enrollment>> GetUserEnrollmentsAsync(Guid userId);
    Task<bool> CheckUserEnrollment(Guid classId, Guid userId);
    Task<IEnumerable<Enrollment>> GetClassroomEnrollmentsAsync(Guid classId, string status);
    Task UpdateEnrollmentAsync();
    Task<bool> ClassHasEnrolledUser(Guid classId);
    Task DeleteEnrollmentAsync(Enrollment enrollment);
}