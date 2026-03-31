using System.ComponentModel.DataAnnotations.Schema;
using esecai.Domain.Entities;

namespace esecai.Domain.Entities;

public class Record
{
    public Guid rec_id { get; set; }
    public string rec_student_name { get; set; } = default!;
    public string rec_scan_url { get; set; } = default!;
    public float rec_total_score { get; set; }
    public float rec_percentage { get; set; }
    public string rec_status { get; set; } = default!;
    public DateTime rec_graded_at { get; set; }
    public DateTime rec_created_at { get; set; }
    public Guid ass_id { get; set; }

    [ForeignKey("ass_id")]
    public Assessment? assessment { get; set; }

    // Collections
    public ICollection<RecordAnswer> record_answers { get; set; } = new List<RecordAnswer>();

    public static Record Build(
        string studentName,
        string scanUrl,
        float totalScore,
        float percentage,
        Guid assId
    ) 
    {
        return new Record
        {
            rec_id = Guid.NewGuid(),
            rec_student_name = studentName,
            rec_scan_url = scanUrl,
            rec_total_score = totalScore,
            rec_percentage = percentage,
            ass_id = assId
        };
    }
}