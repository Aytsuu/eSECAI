using StackExchange.Redis;
using Skwela.Application.Interfaces;
using System.Text.Json;

namespace Skwela.Infrastructure.Services;

public class RedisCacheService : IRedisCacheService
{
    private readonly IDatabase _redisDB;

    public RedisCacheService(IDatabase redisDB)
    {
        _redisDB = redisDB;
    }

    public async Task SaveRedisCacheAsync<T>(string cacheKey, T value, TimeSpan expiration)
    {
        // Convert the generic object into a JSON string
        var jsonValue = JsonSerializer.Serialize(value);

        // Save the resulting string to Redis
        await _redisDB.StringSetAsync(cacheKey, jsonValue, expiration);
    }

    public async Task<string?> GetRedisCacheAsync(string cacheKey)
    {
        var value = await _redisDB.StringGetAsync(cacheKey);
        return value.HasValue ? value.ToString() : null;
    }

    public async Task DeleteRedisCacheAsync(string cacheKey)
    {
        await _redisDB.KeyDeleteAsync(cacheKey);
    }
}