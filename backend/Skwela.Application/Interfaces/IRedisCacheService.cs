
namespace Skwela.Application.Interfaces;

public interface IRedisCacheService
{
  Task SaveRedisCacheAsync<T>(string cacheKey, T value, TimeSpan expiration);
  Task<string?> GetRedisCacheAsync(string cacheKey);
  Task DeleteRedisCacheAsync(string cacheKey);
}