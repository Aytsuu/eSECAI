using eSECAI.Domain.Entities;

namespace eSECAI.Application.Interfaces;

public interface IClassroomRepository
{
    Task<Classroom> AddAsync(Classroom classroom);
    Task<IEnumerable<Classroom>> GetClassroomsByCreatorAsync(Guid userId);
    Task<Classroom> GetClassroomDataAsync(Guid classId);
    Task UpdateClassroomAsync();
    Task DeleteClassroomAsync(Classroom classroom);
}
