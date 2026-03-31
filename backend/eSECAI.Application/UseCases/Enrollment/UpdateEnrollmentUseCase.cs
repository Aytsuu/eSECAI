using esecai.Application.Interfaces;
using esecai.Domain.Entities;
using esecai.Application.DTOs;

namespace esecai.Application.UseCases.Enrollments;

/// <summary>
/// Use case for updating enrollment status
/// Handles toggling student enrollment status between active and inactive
/// </summary>
public class UpdateEnrollmentUseCase
{
    private readonly IEnrollmentRepository _repository;
    private readonly INotificationService _notifService;

    /// <summary>
    /// Initializes the UpdateEnrollmentUseCase with the enrollment repository
    /// </summary>
    /// <param name="repository">Repository for enrollment data operations</param>
    public UpdateEnrollmentUseCase(IEnrollmentRepository repository, INotificationService notifService)
    {
        _repository = repository;
        _notifService = notifService;
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

        Notification notification = Notification.Build(
            userId,
            "Accepted",
            "You are now part of the class"
        );

        await _notifService.SendAsync(notification);

        // Update enrollment status
        return new UserData(
            enrollment.user!.user_id,
            enrollment.user!.email,
            enrollment.user!.display_name,
            enrollment.user!.display_image
        );
    }


}