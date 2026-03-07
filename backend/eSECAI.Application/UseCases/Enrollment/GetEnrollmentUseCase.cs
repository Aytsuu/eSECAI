using eSECAI.Application.Interfaces;

namespace eSECAI.Application.UseCases.Enrollments;

/// <summary>
/// Use case for retrieving student enrollment information
/// Handles fetching all active enrollments for a specific student
/// </summary>
public class GetEnrollmentUseCase
{
    /// <summary>
    /// Repository for enrollment data operations
    /// </summary>
    private IEnrollmentRepository _repository;

    /// <summary>
    /// Initializes the GetEnrollmentUseCase with the enrollment repository
    /// </summary>
    /// <param name="repository">Repository for enrollment data operations</param>
    public GetEnrollmentUseCase(IEnrollmentRepository repository)
    {
        _repository = repository;
    }

    /// <summary>
    /// Retrieves all active enrollments for a specific user
    /// Returns detailed information about each classroom the user is enrolled in
    /// </summary>
    /// <param name="userId">The ID of the user</param>
    /// <returns>Collection of EnrollmentDto objects with classroom details</returns>
    public async Task<IEnumerable<EnrollmentDto>> ExecuteGetUserEnrollmentAsync(Guid userId)
    {
        // Retrieve users's active enrollments from database
        var enrollments = await _repository.GetUserEnrollmentAsync(userId);

        // Map enrollment entities to DTOs with classroom information
        return enrollments.Select(e => new EnrollmentDto(
            e.class_id,
            e.classroom?.class_name ?? "Unknown Classroom",
            e.classroom?.class_description ?? string.Empty,
            e.enroll_created_at
        ));
    }
}