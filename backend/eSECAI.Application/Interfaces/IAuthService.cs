using eSECAI.Domain.Entities;

namespace eSECAI.Application.Interfaces;

public interface IAuthService
{
  string GenerateJwtToken(User user);
  string GenerateRefreshToken();
}