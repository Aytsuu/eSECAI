using System.ComponentModel.DataAnnotations.Schema;
using esecai.Domain.Entities;

namespace esecai.Domain.Entities;

public class Question
{
    public Guid quest_id { get; set; }
    public int quest_num { get; set; }
    public string quest_type { get; set; } = default!;
    public string quest_text { get; set; } = default!;
    
    [Column(TypeName = "jsonb")]
    public string quest_correct_answer { get; set; } = default!;

    public float quest_max_points { get; set; }
    public float quest_ai_confidence { get; set; }
    public Guid ass_id { get; set; }

    [ForeignKey("ass_id")]
    public Assessment? assessment { get; set; }

    // Collections
    public ICollection<RecordAnswer> record_answers { get; set; } = new List<RecordAnswer>();

    // Collections
    public ICollection<Assessment> assessments { get; set; } = new List<Assessment>();

    public static Question Build(
        int num,
        string type,
        string text,
        string answer,
        float maxPoints,
        float aiConfidence,
        Guid assId
    )
    {
        return new Question
        {
            quest_id = Guid.NewGuid(),
            quest_num = num,
            quest_type = type,
            quest_text = text,
            quest_correct_answer = answer,
            quest_max_points = maxPoints,
            quest_ai_confidence = aiConfidence,
            ass_id = assId
        };
    }
}