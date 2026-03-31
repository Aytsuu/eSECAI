using esecai.Application.Interfaces;
using esecai.Domain.Entities;

namespace esecai.Application.UseCases.Classrooms;

/// <summary>
/// Use case for deleting classrooms
/// Ensures that classrooms with active students cannot be deleted
/// </summary>
public class DeleteClassroomUseCase
{
    /// <summary>
    /// Repository for classroom data operations
    /// </summary>
    private readonly IClassroomRepository _classroomRepo;
    private readonly IMinioFileService _minioFileService;

    /// <summary>
    /// Initializes the DeleteClassroomUseCase with the classroom repository
    /// </summary>
    /// <param name="repository">Repository for classroom data operations</param>
    public DeleteClassroomUseCase(IClassroomRepository classroomRepo, IMinioFileService minioFileService) 
    {
        _classroomRepo = classroomRepo;
        _minioFileService = minioFileService;
    }

    /// <summary>
    /// Executes the classroom deletion process
    /// A classroom can only be deleted if it has no active enrolled students
    /// </summary>
    /// <param name="classId">The ID of the classroom to delete</param>
    /// <returns>Async task that completes when deletion is successful</returns>
    /// <exception cref="InvalidOperationException">Thrown if classroom has active students enrolled</exception>
    public async Task ExecuteDeleteClassroomAsync(Guid classId)
    {
        // Delete the classroom
        var classroom = await _classroomRepo.GetClassroomDataAsync(classId);

        if (classroom == null)
        {
            throw new KeyNotFoundException("Classroom not found");
        }

        if (!string.IsNullOrWhiteSpace(classroom.class_banner)) 
        {
            await _minioFileService.DeleteFileAsync(classroom.class_banner);
        }

        await _classroomRepo.DeleteClassroomAsync(classroom);
    }
}