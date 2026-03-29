using Microsoft.EntityFrameworkCore;
using eSECAI.Infrastructure.Data;
using eSECAI.Domain.Entities;
using eSECAI.Application.Interfaces;

namespace eSECAI.Infrastructure.Repositories;

/// <summary>
/// Enrollment Repository
/// Data access layer for student enrollment operations
/// Handles enrollment creation, retrieval, and status updates
/// </summary>
public class EnrollmentRepository : IEnrollmentRepository
{
    private readonly AppDbContext _context;

    /// <summary>
    /// Initializes the EnrollmentRepository with database context
    /// </summary>
    /// <param name="context">Entity Framework database context</param>
    public EnrollmentRepository(AppDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Creates a new enrollment or reactivates an existing one
    /// If a student is already enrolled (even if inactive), the enrollment is reactivated
    /// Otherwise, a new enrollment record is created
    /// </summary>
    /// <param name="enrollment">Enrollment entity to be created or reactivated</param>
    /// <returns>The enrollment record (newly created or reactivated)</returns>
    public async Task<Enrollment> CreateEnrollmentAsync(Enrollment enrollment)
    {
        _context.Enrollments.Add(enrollment);
        await _context.SaveChangesAsync();
        
        await _context.Entry(enrollment).Reference(e => e.classroom).LoadAsync();
        
        return enrollment;
    }

    public async Task<Enrollment> GetEnrollmentAsync(Guid classId, Guid userId)
    {
        var enrollment = await _context.Enrollments
            .Include(e => e.classroom!)
            .Include(e => e.user!)
            .FirstOrDefaultAsync(e => e.class_id == classId && e.user_id == userId);

        if (enrollment == null)
        {
            throw new KeyNotFoundException("User is not enrolled in this class.");
        }
        
        return enrollment;
    }

    /// <summary>
    /// Retrieves all active enrollments for a specific user
    /// Returns detailed information about each classroom the user is enrolled in
    /// </summary>
    /// <param name="userId">The ID of the user</param>
    /// <returns>Collection of active Enrollment entities with classroom information</returns>
    public async Task<IEnumerable<Enrollment>> GetUserEnrollmentsAsync(Guid userId)
    {
        // Query active enrollments for the user with classroom details
        return await _context.Enrollments
            .Include(e => e.classroom!)
                .ThenInclude(c => c.user!)
            .Where(e => e.user_id == userId)
            .ToListAsync();
    }

    /// <summary>
    /// Check if any enrollments has the following classId
    /// </summary>
    public async Task<bool> ClassHasEnrolledUser(Guid classId)
    {
        return await _context.Enrollments.AnyAsync(e => e.class_id == classId);
    }

    /// <summary>
    /// Checking if a user is enrolled in this classroom
    /// </summary>
    /// <param name="classId">The ID of the classroom</param>
    /// <param name="userId">The ID of the student</param>
    /// <returns>Boolean result of the check</returns>
    public async Task<bool> CheckUserEnrollment(Guid classId, Guid userId)
    {
        var result = await _context.Enrollments
            .AnyAsync(e => e.class_id == classId && e.user_id == userId);

        return result;
    }

    /// <summary>
    /// Gets all the enrolled users in a classroom
    /// </summary>
    /// <param name="classId">The ID of the classroom</param>
    /// <param name="isApproved">Fetch only approved (true) or pending (false) enrollments</param>
    /// <returns>Collection of enrolled users</returns>
    public async Task<IEnumerable<Enrollment>> GetClassroomEnrollmentsAsync(Guid classId, string status)
    {
        return await _context.Enrollments
            .Include(e => e.user)
            .Where(e => e.class_id == classId && e.enroll_status == status)
            .ToListAsync();
    }

    /// <summary>
    /// Updates the enrollment status for a student in a classroom
    /// Toggles between 'active' and 'inactive' states
    /// </summary>
    /// <param name="classId">The ID of the classroom</param>
    /// <param name="userId">The ID of the student</param>
    /// <returns>The updated Enrollment entity with new status</returns>
    /// <exception cref="KeyNotFoundException">Thrown if enrollment record is not found</exception>
    public async Task UpdateEnrollmentAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task DeleteEnrollmentAsync(Enrollment enrollment)
    {
        _context.Enrollments.Remove(enrollment);
        await _context.SaveChangesAsync();
    }
}