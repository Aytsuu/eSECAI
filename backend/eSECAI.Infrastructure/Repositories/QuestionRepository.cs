using esecai.Application.Interfaces;
using esecai.Domain.Entities;
using esecai.Infrastructure.Data;

namespace esecai.Infrastructure.Repositories;

public class QuestionRepository : IQuestionRepository
{
    private readonly AppDbContext _context;

    public QuestionRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Question> CreateQuestionAsync(Question question)
    {
        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        return question;
    }

    public async Task<IEnumerable<Question>> CreateQuestionsBulkAsync(IEnumerable<Question> questions)
    {
        // EF Core will automatically "batch" these into 
        // a single transaction with multiple insert statements.
        await _context.Questions.AddRangeAsync(questions);
        await _context.SaveChangesAsync();

        return questions;
    }
}