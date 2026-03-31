using esecai.Domain.Exceptions;
using System.ComponentModel.DataAnnotations.Schema;

namespace esecai.Domain.Entities;

public class Notification {
    public Guid notif_id { get; set; } = Guid.NewGuid();
    public Guid user_id { get; set; }
    public string notif_title { get; set; } = string.Empty;
    public string notif_message { get; set; } = string.Empty;
    public bool notif_is_read { get; set; } = false;
    public DateTime notif_created_at { get; set; } = DateTime.UtcNow;

    [ForeignKey("user_id")]
    public User? user { get; set; }

    public static Notification Build(Guid userId, string title, string message)
    {
        return new Notification 
        {
            user_id = userId,
            notif_title = title,
            notif_message = message
        };
    }
}