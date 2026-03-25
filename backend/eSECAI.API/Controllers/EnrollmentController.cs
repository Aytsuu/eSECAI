
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using eSECAI.Application.UseCases.Enrollments;
using eSECAI.Application.DTOs;
using System.Security.Claims;

namespace eSECAI.API.Controllers;

/// <summary>
/// Enrollment Controller
/// Handles student enrollment in classrooms, retrieval of student enrollments,
/// and management of enrollment status
/// </summary>
[ApiController]
[Route("api/enrollment")]
public class EnrollmentController : ControllerBase
{
    private readonly CreateEnrollmentUseCase _createUseCase;
    private readonly GetEnrollmentUseCase _getUseCase;
    private readonly UpdateEnrollmentUseCase _updateUseCase;
    private readonly DeleteEnrollmentUseCase _deleteUseCase;
    private readonly GetClassroomEnrollmentsUseCase _getClassEnrollmentsUseCase;

    /// <summary>
    /// Initializes the EnrollmentController with required use cases
    /// </summary>
    /// <param name="createUseCase">Use case for creating/enrolling in classrooms</param>
    /// <param name="getUseCase">Use case for retrieving student enrollments</param>
    /// <param name="updateUseCase">Use case for updating enrollment status</param>
    public EnrollmentController(
        CreateEnrollmentUseCase createUseCase, 
        GetEnrollmentUseCase getUseCase, 
        UpdateEnrollmentUseCase updateUseCase,
        DeleteEnrollmentUseCase deleteUseCase,
        GetClassroomEnrollmentsUseCase getClassEnrollmentsUseCase
    )
    {
        _createUseCase = createUseCase;
        _getUseCase = getUseCase;
        _updateUseCase = updateUseCase;
        _deleteUseCase = deleteUseCase;
        _getClassEnrollmentsUseCase = getClassEnrollmentsUseCase;
    }

    /// <summary>
    /// Enrolls a student in a classroom
    /// If the student is already enrolled (but inactive), reactivates the enrollment
    /// </summary>
    /// <param name="request">CreateEnrollmentDto containing classId and userId</param>
    /// <returns>The enrollment record (newly created or reactivated)</returns>
    /// <response code="200">Student successfully enrolled</response>
    /// <response code="400">Invalid enrollment data or enrollment failed</response>
    /// <response code="401">User is not authenticated</response>
    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> EnrollUser(CreateEnrollmentDto request)
    {
        try
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized(new { message = "Invalid or missing user ID in token." });
            }

            var enrollment = await _createUseCase.ExecuteCreateEnrollmentAsync(request.classId, userId);
            return Ok(enrollment);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Retrieves all active enrollments for a specific student
    /// Returns detailed information about each classroom the student is enrolled in
    /// </summary>
    /// <param name="userId">The ID of the student</param>
    /// <returns>List of EnrollmentDto objects with classroom details</returns>
    /// <response code="200">Enrollments successfully retrieved</response>
    /// <response code="400">Invalid user ID or retrieval failed</response>
    /// <response code="401">User is not authenticated</response>
    [Authorize]
    [HttpGet("get")]
    public async Task<IActionResult> GetEnrollments([FromQuery] string status)
    {
        try
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized(new { message = "Invalid or missing user ID in token." });
            }
            
            var enrollments = status == "accepted" 
                ? (object)await _getUseCase.ExecuteAcceptedEnrollmentAsync(userId) 
                : (object)await _getUseCase.ExecutePendingEnrollmentAsync(userId);

            return Ok(enrollments);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Updates the enrollment status for a student in a classroom
    /// Toggles between 'active' and 'inactive' states
    /// </summary>
    /// <param name="classId">The ID of the classroom</param>
    /// <param name="userId">The ID of the student</param>
    /// <returns>The updated enrollment record with new status</returns>
    /// <response code="200">Enrollment status successfully updated</response>
    /// <response code="400">Invalid request parameters or update failed</response>
    [Authorize]
    [HttpPatch("update/{classId}/{userId}/status")]
    public async Task<IActionResult> UpdateEnrollmentStatus(Guid classId, Guid userId, [FromBody] UpdateEnrollmentStatusDto request)
    {
        try
        {
            var update = await _updateUseCase.ExecuteUpdateEnrollmentStatusAsync(classId, userId, request.status);
            return Ok(update);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Authorize]
    [HttpDelete("delete/{classId}")]
    public async Task<IActionResult> DeleteEnrollment(Guid classId)
    {
        try 
        {
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (!Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized(new { message = "Invalid or missing user ID in token." });
            }

            await _deleteUseCase.ExecuteDeleteEnrollmentAsync(classId, userId);
            
            return Ok(new { message = "Enrollment request cancelled successfully" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Gets all enrolled users for a specific classroom
    /// </summary>
    /// <param name="classId">The ID of the classroom</param>
    /// <param name="isApproved">Fetch only approved (true) or pending (false) enrollments</param>
    /// <returns>Collection of enrolled users</returns>
    [Authorize]
    [HttpGet("classroom/{classId}/users")]
    public async Task<IActionResult> GetClassroomEnrollments(Guid classId, [FromQuery] string status)
    {
        try
        {
            var users = await _getClassEnrollmentsUseCase.ExecuteGetClassroomEnrollmentsAsync(classId, status);
            return Ok(users);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}
