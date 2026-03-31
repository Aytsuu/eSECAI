using esecai.Domain.Entities;

public interface INotificationService
{
    Task SendAsync(Notification notification);
}