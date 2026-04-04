using System.ComponentModel.DataAnnotations.Schema;
using esecai.Domain.Entities;

namespace esecai.Domain.Entities;

public class Assessment
{
    public Guid ass_id { get; set; }
    public string ass_title { get; set; } = default!;
    public string ass_type { get; set; } = default!;
    public string ass_answer_key_url { get; set; } = default!;
    public string ass_instruction { get; set; } = default!;
    public float ass_total_points { get; set; }
    public string ass_status { get; set; } = default!;
    public DateTime ass_created_at { get; set; }
    public DateTime ass_updated_at { get; set; }
    public Guid class_id { get; set; }

    [ForeignKey("class_id")]
    public Classroom? classroom { get; set; }

    // Collections
    public ICollection<Question> questions { get; set; } = new List<Question>();
    public ICollection<Record> records { get; set; } = new List<Record>();

    public static Assessment Build(
        string title, 
        string type, 
        string answerKey, 
        string instruction, 
        float totalPoints, 
        Guid classId
    )
    {
        return new Assessment 
        {
            ass_id = Guid.NewGuid(),
            ass_title = title,
            ass_type = type,
            ass_answer_key_url = answerKey,
            ass_instruction = instruction,
            ass_total_points = totalPoints,
            class_id = classId
        };
    }
}