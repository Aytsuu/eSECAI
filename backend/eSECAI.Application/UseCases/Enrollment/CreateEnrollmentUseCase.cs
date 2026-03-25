using eSECAI.Application.Interfaces;
using eSECAI.Domain.Entities;
using eSECAI.Application.DTOs;

namespace eSECAI.Application.UseCases.Enrollments;

/// <summary>
/// Use case for creating student enrollments in classrooms
/// Handles validation and persistence of enrollment records
/// </summary>
public class CreateEnrollmentUseCase
{
    private readonly IEnrollmentRepository _repository;

    /// <summary>
    /// Initializes the CreateEnrollmentUseCase with the enrollment repository
    /// </summary>
    /// <param name="repository">Repository for enrollment data operations</param>
    public CreateEnrollmentUseCase(IEnrollmentRepository repository)
    {
        _repository = repository;
    }

    /// <summary>
    /// Executes the enrollment creation process
    /// Validates enrollment data through domain entity and persists to database
    /// If student is already enrolled but inactive, reactivates the enrollment
    /// </summary>
    /// <param name="dto">CreateEnrollmentDto containing classId and userId</param>
    /// <returns>The Enrollment entity (newly created or reactivated)</returns>
    /// <exception cref="DomainException">Thrown if enrollment data fails domain validation</exception>
    public async Task<PendingEnrollment> ExecuteCreateEnrollmentAsync(Guid classId, Guid userId)
    {
        // Create enrollment with domain validation
        Enrollment enrollment;
        Enrollment hasEnrollment = await _repository.GetEnrollmentAsync(classId, userId);

        if (hasEnrollment == null)
        {
            Enrollment instance = Enrollment.Build(classId, userId);
            enrollment = await _repository.CreateEnrollmentAsync(instance);

            if (enrollment == null)
            {
                throw new InvalidOperationException();
            }
        }
        else
        {
            enrollment = hasEnrollment;
        }

        // Persist to database - repository handles duplicate enrollment logic
        return new PendingEnrollment(
            enrollment.classroom!.class_id,
            enrollment.enroll_created_at,
            enrollment.classroom!.class_name
        );
    }
}