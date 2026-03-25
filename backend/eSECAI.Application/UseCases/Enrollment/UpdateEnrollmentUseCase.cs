using eSECAI.Application.Interfaces;
using eSECAI.Domain.Entities;
using eSECAI.Application.DTOs;

namespace eSECAI.Application.UseCases.Enrollments;

/// <summary>
/// Use case for updating enrollment status
/// Handles toggling student enrollment status between active and inactive
/// </summary>
public class UpdateEnrollmentUseCase
{
    private readonly IEnrollmentRepository _repository;

    /// <summary>
    /// Initializes the UpdateEnrollmentUseCase with the enrollment repository
    /// </summary>
    /// <param name="repository">Repository for enrollment data operations</param>
    public UpdateEnrollmentUseCase(IEnrollmentRepository repository)
    {
        _repository = repository;
    }

    public async Task<UserData> ExecuteUpdateEnrollmentStatusAsync(Guid classId, Guid userId, string status)
    {
        // Find the enrollment record
        var enrollment = await _repository.GetEnrollmentAsync(classId, userId);

        if (enrollment == null)
        {
            throw new KeyNotFoundException("User not found in this classroom");
        }

        enrollment.enroll_status = status;
        await _repository.UpdateEnrollmentAsync();

        // Update enrollment status
        return new UserData(
            enrollment.user!.user_id,
            enrollment.user!.email,
            enrollment.user!.display_name,
            enrollment.user!.display_image
        );
    }


}