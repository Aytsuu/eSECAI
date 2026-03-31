using esecai.Infrastructure.Data;
using esecai.Application.Interfaces;
using Microsoft.AspNetCore.SignalR;
using esecai.Infrastructure.Hubs;
using esecai.Domain.Entities;

public class NotificationService : INotificationService {
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly AppDbContext _context;

    public NotificationService(IHubContext<NotificationHub> hubContext, AppDbContext context) {
        _hubContext = hubContext;
        _context = context;
    }

    public async Task SendAsync(Notification notification) {
        // 1. Save to Database (Persistence)
        // var notification = new Notification { UserId = userId, Title = title, Message = message };
        _context.Notifications.Add(notification);
        await _context.SaveChangesAsync();

        // 2. Trigger In-App (SignalR)
        // We use .User(id) which maps to the NameIdentifier in your JWT
        await _hubContext.Clients.User(notification.user_id.ToString())
            .SendAsync("ReceiveNotification", new { title = notification.notif_title, message = notification.notif_message, createdAt = notification.notif_created_at });

        // 3. Trigger Push (Logic for Firebase/Expo would go here)
        // await _pushProvider.SendPushAsync(userId, title, message);
    }
}