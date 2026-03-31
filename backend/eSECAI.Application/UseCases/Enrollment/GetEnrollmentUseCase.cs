using esecai.Application.Interfaces;
using esecai.Application.DTOs;

namespace esecai.Application.UseCases.Enrollments;

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
    public async Task<IEnumerable<ClassroomDataResponse>> ExecuteAcceptedEnrollmentAsync(Guid userId)
    {
        // Retrieve users's active enrollments from database
        var enrollments = await _repository.GetUserEnrollmentsAsync(userId);

        // Map enrollment entities to DTOs with classroom information
        return enrollments
            .Where(e => e.enroll_status == "accepted")
            .Select(e => new ClassroomDataResponse(
                e.class_id,
                e.classroom!.class_name,
                e.classroom!.class_description,
                e.classroom!.class_banner,
                e.classroom!.class_created_at,
                new UserData(
                    e.classroom.user!.user_id,
                    e.classroom.user!.email,
                    e.classroom.user!.display_name,
                    e.classroom.user.display_image ?? string.Empty
                )
            ));
    }

    public async Task<IEnumerable<PendingEnrollment>> ExecutePendingEnrollmentAsync(Guid userId)
    {
        // Retrieve users's active enrollments from database
        var enrollments = await _repository.GetUserEnrollmentsAsync(userId);

        // Map enrollment entities to DTOs with classroom information
        return enrollments
            .Where(e => e.enroll_status == "pending")
            .Select(e => new PendingEnrollment(
                e.classroom!.class_id,
                e.enroll_created_at,
                e.classroom.class_name
            ));
    }

}