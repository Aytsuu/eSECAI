using esecai.Application.Interfaces;
using esecai.Domain.Entities;

namespace esecai.Application.UseCases.Assessments;

public class CreateAssessmentUseCase
{
    private readonly IAssessmentRepository _repository;

    public CreateAssessmentUseCase(IAssessmentRepository repository)
    {
        _repository = repository;
    }

}