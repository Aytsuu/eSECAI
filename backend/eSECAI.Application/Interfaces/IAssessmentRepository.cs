using esecai.Domain.Entities;

public interface IAssessmentRepository
{
    Task<Assessment> CreateAssessmentAsync(Assessment assessment);
}