using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace eSECAI.Infrastructure.Hubs;

[Authorize]
public class NotificationHub : Hub { }