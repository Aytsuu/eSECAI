using esecai.Domain.Entities;

namespace esecai.Application.Interfaces;

public interface IClassroomRepository
{
    Task<Classroom> AddAsync(Classroom classroom);
    Task<IEnumerable<Classroom>> GetClassroomsByCreatorAsync(Guid userId);
    Task<Classroom> GetClassroomDataAsync(Guid classId);
    Task UpdateClassroomAsync();
    Task DeleteClassroomAsync(Classroom classroom);
}
