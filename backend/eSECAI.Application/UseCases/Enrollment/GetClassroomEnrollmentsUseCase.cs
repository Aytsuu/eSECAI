using eSECAI.Application.Interfaces;
using eSECAI.Application.DTOs;
using eSECAI.Domain.Entities;

namespace eSECAI.Application.UseCases.Enrollments;

public class GetClassroomEnrollmentsUseCase
{
    private readonly IEnrollmentRepository _repository;

    public GetClassroomEnrollmentsUseCase(IEnrollmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<UserData>> ExecuteGetClassroomEnrollmentsAsync(Guid classId, string status)
    {
        var enrollments = await _repository.GetClassroomEnrollmentsAsync(classId, status);

        return enrollments.Select(e => new UserData(
            e.user!.user_id,
            e.user!.email,
            e.user!.display_name,
            e.user!.display_image
        ));
    }
}