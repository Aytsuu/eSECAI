
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using eSECAI.Application.UseCases.Classrooms;
using eSECAI.Application.DTOs;
using System.Security.Claims;

namespace eSECAI.API.Controllers;

/// <summary>
/// Classrooms Controller
/// Handles classroom creation, retrieval, and deletion operations
/// Only authenticated users (teachers/admins) can access these endpoints
/// </summary>
[ApiController]
[Route("api/classroom")]
public class ClassroomsController : ControllerBase
{
    private readonly CreateClassroomUseCase _createUseCase;
    private readonly GetClassroomUseCase _getUseCase;
    private readonly DeleteClassroomUseCase _deleteUseCase;
    private readonly UpdateClassroomUseCase _updateUseCase;

    /// <summary>
    /// Initializes the ClassroomsController with required use cases
    /// </summary>
    /// <param name="createUseCase">Use case for creating classrooms</param>
    /// <param name="getUseCase">Use case for retrieving classroom data</param>
    /// <param name="deleteUseCase">Use case for deleting classrooms</param>
    public ClassroomsController(
        CreateClassroomUseCase createUseCase, 
        GetClassroomUseCase getUseCase, 
        DeleteClassroomUseCase deleteUseCase,
        UpdateClassroomUseCase updateUseCase
    )
    {
        _createUseCase = createUseCase;
        _getUseCase = getUseCase;
        _deleteUseCase = deleteUseCase;
        _updateUseCase = updateUseCase;
    }

    // This record only lives in the API/Controller layer (Must be placed here since we need IFormFile)
    public record CreateClassroomRequestWeb(
        string name,
        string? description,
        IFormFile? bannerFile
    );

    public record UpdateClassroomRequestWeb(
        string? name,
        string? description,
        IFormFile? bannerFile
    );

    /// <summary>
    /// Creates a new classroom
    /// Only authenticated users can create classrooms
    /// </summary>
    /// <param name="request">ClassroomRequestWeb containing classroom name, description and file</param>
    /// <returns>The created Classroom object</returns>
    /// <response code="200">Classroom successfully created</response>
    /// <response code="400">Invalid classroom data or creation failed</response>
    /// <response code="401">User is not authenticated</response>
    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> CreateClassroom([FromForm] CreateClassroomRequestWeb request)
    {
        try
        {
            // Extract userId string from access token
            var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
            
            // Safely parse to string to type Guid
            if (!Guid.TryParse(userIdString, out Guid userId))
            {
                return Unauthorized(new { message = "Invalid or missing user ID in token." });
            }

            Stream? stream = null;
            if (request.bannerFile != null)
            {
                stream = request.bannerFile.OpenReadStream();
            }

            // Map the Web Request to the Application DTO
            var applicationRequest = new CreateClassroomRequest(
                userId,
                request.name,
                request.description,
                stream,
                request.bannerFile?.ContentType,
                request.bannerFile?.FileName
            );

            var classroom = await _createUseCase.ExecuteCreateClassroomAsync(applicationRequest);

            return Ok(classroom);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Update a classroom
    /// </summary>
    /// <param name="request">ClassroomRequestWeb containing classroom name, description and file</param>
    /// <returns>List of Classroom objects created by the user</returns>
    /// <response code="200">Classrooms successfully retrieved</response>
    /// <response code="400">Invalid user ID or retrieval failed</response>
    /// <response code="401">User is not authenticated</response>
    [Authorize]
    [HttpPatch("patch/{classId}")]
    public async Task<IActionResult> UpdateClassroom(Guid classId,[FromForm] UpdateClassroomRequestWeb request)
    {
        try
        {
            Stream? stream = null;
            if (request.bannerFile != null)
            {
                stream = request.bannerFile.OpenReadStream();
            }

            // Map the Web Request to the Application DTO
            var applicationRequest = new UpdateClassroomRequest(
                classId,
                request.name,
                request.description,
                stream,
                request.bannerFile?.ContentType,
                request.bannerFile?.FileName
            );

            var classroom = await _updateUseCase.ExecuteUpdateClassroomAsync(applicationRequest);

            return Ok(classroom);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
    

    /// <summary>
    /// Retrieves all classrooms created by a specific user (teacher)
    /// </summary>
    /// <param name="userId">The ID of the user (teacher) whose classrooms to retrieve</param>
    /// <returns>List of Classroom objects created by the user</returns>
    /// <response code="200">Classrooms successfully retrieved</response>
    /// <response code="400">Invalid user ID or retrieval failed</response>
    /// <response code="401">User is not authenticated</response>
    [Authorize]
    [HttpGet("get/creator-{userId}")]
    public async Task<IActionResult> GetClassroomsByCreator(Guid userId)
    {
        try
        {
            var classrooms = await _getUseCase.ExecuteGetByCreatorAsync(userId);
            return Ok(classrooms);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Retrieves detailed information about a specific classroom
    /// Performs authorization checks based on user role:
    /// - Teachers can only access their own classrooms
    /// - Students can only access classrooms they are enrolled in
    /// </summary>
    /// <param name="classId">The ID of the classroom to retrieve</param>
    /// <param name="userId">The ID of the user requesting access</param>
    /// <param name="role">The role of the user (teacher or student)</param>
    /// <returns>ClassroomResponse with classroom details and teacher information</returns>
    /// <response code="200">Classroom data successfully retrieved</response>
    /// <response code="403">User doesn't have permission to access this classroom</response>
    /// <response code="404">Classroom not found</response>
    /// <response code="400">Invalid request parameters</response>
    /// <response code="401">User is not authenticated</response>
    [Authorize]
    [HttpGet("get/{classId}/{userId}")]
    public async Task<IActionResult> GetClassroomData(Guid classId, Guid userId)
    {
        try
        {
            var classroom = await _getUseCase.ExecuteGetClassroomDataAsync(classId, userId);
            return Ok(classroom);
        }
        catch (KeyNotFoundException knfEx)
        {
            return NotFound(knfEx.Message);
        }
        catch (UnauthorizedAccessException uaEx)
        {
            return Forbid(uaEx.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    /// <summary>
    /// Deletes a classroom
    /// A classroom can only be deleted if it has no active enrolled students
    /// </summary>
    /// <param name="classId">The ID of the classroom to delete</param>
    /// <returns>No content on successful deletion</returns>
    /// <response code="200">Classroom successfully deleted</response>
    /// <response code="409">Cannot delete classroom because it has active students</response>
    /// <response code="400">Invalid request or deletion failed</response>
    /// <response code="401">User is not authenticated</response>
    [Authorize]
    [HttpDelete("delete/{classId}")]
    public async Task<IActionResult> DeleteClassroom(Guid classId)
    {
        try 
        {
            await _deleteUseCase.ExecuteDeleteClassroomAsync(classId);
            return Ok();
        }
        catch (InvalidOperationException ioEx)
        {
            return Conflict(ioEx.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }
}