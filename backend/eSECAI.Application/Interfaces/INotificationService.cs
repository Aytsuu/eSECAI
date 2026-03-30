using eSECAI.Domain.Entities;

public interface INotificationService
{
    Task SendAsync(Notification notification);
}