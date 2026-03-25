using eSECAI.Application.Interfaces;

namespace eSECAI.Application.UseCases.Enrollments;

public class DeleteEnrollmentUseCase
{
    private readonly IEnrollmentRepository _repository;

    public DeleteEnrollmentUseCase(IEnrollmentRepository repository)
    {
        _repository = repository;
    }

    public async Task ExecuteDeleteEnrollmentAsync(Guid classId, Guid userId)
    {
        var enrollment = await _repository.GetEnrollmentAsync(classId, userId);

        if (enrollment == null)
        {
            throw new KeyNotFoundException("User is not enrolled in this class.");
        }

        await _repository.DeleteEnrollmentAsync(enrollment);
    }
}