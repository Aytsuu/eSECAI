using esecai.Application.Interfaces;
using esecai.Infrastructure.Data;
using esecai.Domain.Entities;

namespace esecai.Infrastructure.Repositories;

public class AssessmentRepository : IAssessmentRepository
{   
    private readonly AppDbContext _context;

    public AssessmentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Assessment> CreateAssessmentAsync(Assessment assessment)
    {
        _context.Assessments.Add(assessment);
        await _context.SaveChangesAsync();

        return assessment;
    }
}