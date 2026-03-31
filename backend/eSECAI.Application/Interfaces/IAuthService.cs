using esecai.Domain.Entities;

namespace esecai.Application.Interfaces;

public interface IAuthService
{
  string GenerateJwtToken(User user);
  string GenerateRefreshToken();
}