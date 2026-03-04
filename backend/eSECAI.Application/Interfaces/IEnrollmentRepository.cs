
using eSECAI.Domain.Entities;

namespace eSECAI.Application.Interfaces;

public interface IEnrollmentRepository
{
    Task<Enrollment> AddEnrollmentAsync(Enrollment enrollment);
    Task<IEnumerable<Enrollment>> GetStudentEnrollmentAsync(Guid userId);
    Task<Enrollment> UpdateEnrollmentStatusAsync(Guid classId, Guid userId);
}