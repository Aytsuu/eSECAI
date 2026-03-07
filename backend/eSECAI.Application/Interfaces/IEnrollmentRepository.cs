
using eSECAI.Domain.Entities;

namespace eSECAI.Application.Interfaces;

public interface IEnrollmentRepository
{
    Task<Enrollment> AddEnrollmentAsync(Enrollment enrollment);
    Task<IEnumerable<Enrollment>> GetUserEnrollmentAsync(Guid userId);
    Task<bool> CheckUserEnrollment(Guid classId, Guid userId);
    Task<Enrollment> UpdateEnrollmentStatusAsync(Guid classId, Guid userId);
    Task<bool> ClassHasEnrolledUser(Guid classId);
}