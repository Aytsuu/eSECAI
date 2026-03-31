using esecai.Domain.Entities;

namespace esecai.Application.Interfaces;

public interface IAuthRepository
{
    Task<User> SignupAsync(User user);
    Task<User> LoginAsync(string email, string password);
    Task<User> RefreshTokenAsync(string refreshToken);
    Task<User> GoogleSigninAsync(string email);
    Task<User> CurrentUserAsync(Guid? userId, string? email);
    Task UpdateUserAsync();
}