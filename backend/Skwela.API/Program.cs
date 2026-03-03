using Microsoft.EntityFrameworkCore;
using Skwela.Infrastructure;
using Skwela.Application;
using Skwela.Infrastructure.Data;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;
using System.Text.Json;
using System.Collections.Concurrent;

/// <summary>
/// Skwela API Application Entry Point
/// Sets up all required services, middleware, and database configuration for the learning management system
/// </summary>
var builder = WebApplication.CreateBuilder(args);


// Retrieve JWT secret key from configuration and validate it exists
var jwtKey = builder.Configuration["Jwt:Key"];

if (string.IsNullOrEmpty(jwtKey))
{
    throw new InvalidOperationException("JWT Key is not configured.");
}

// Register infrastructure services (database, repositories, authentication)
builder.Services.AddInfrastructure(builder.Configuration);

// Register application services (use cases, business logic)
builder.Services.AddApplication();

// Retrieve database connection string and validate it exists
var conn = builder.Configuration.GetConnectionString("DefaultConnection");

if (string.IsNullOrEmpty(conn))
{
    throw new InvalidOperationException("Database connection string is not configured.");
}

// Configure controllers and JSON serialization to handle enums as strings
builder.Services.AddControllers()
    .AddJsonOptions(options => 
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });
    
// Add Swagger/OpenAPI documentation generation
builder.Services.AddSwaggerGen();

// Add authorization policies
builder.Services.AddAuthorization();


// Configure CORS (Cross-Origin Resource Sharing) to allow frontend to access API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // Allow requests from specified frontend origins
        policy.WithOrigins(
            "https://skwela.paoloaraneta.dev",
            "http://skwela.local:3000",
            "http://127.0.0.1:3000",
            "http://localhost:3000"
        )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// Rate Limiting
var policyWindows = new Dictionary<string, TimeSpan>
{
    { "AuthPolicy", TimeSpan.FromMinutes(3) },
    { "OtpPolicy",  TimeSpan.FromMinutes(3) }
};

// Track the reset time per policy
var policyResetTimes = new ConcurrentDictionary<string, DateTimeOffset>();

builder.Services.AddRateLimiter(options =>
{
    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "text/plain; charset=utf-8";

        var endpoint = context.HttpContext.GetEndpoint();
        var policyName = endpoint?.Metadata
            .GetMetadata<EnableRateLimitingAttribute>()?.PolicyName
            ?? "AuthPolicy";

        var window = policyWindows.GetValueOrDefault(policyName, TimeSpan.FromMinutes(3));
        var now = DateTimeOffset.UtcNow;

        // Get or initialize the reset time for this policy
        var resetTime = policyResetTimes.AddOrUpdate(
            policyName,
            // First time seeing this policy — reset is one full window from now
            addValue: now.Add(window),
            // Already tracked — if reset has passed, roll it forward
            updateValueFactory: (_, existingReset) =>
                existingReset > now
                    ? existingReset           // window still active, keep it
                    : now.Add(window)         // window expired, start a new one
        );

        var secondsRemaining = Math.Max(0, Math.Round((resetTime - now).TotalSeconds));

        context.HttpContext.Response.Headers.RetryAfter = secondsRemaining.ToString();

        await context.HttpContext.Response.WriteAsync(
            $"Too many requests. Please wait {secondsRemaining} seconds before trying again.",
            token);
    };

    options.AddFixedWindowLimiter("AuthPolicy", limiterOptions =>
    {
        limiterOptions.PermitLimit = 4;
        limiterOptions.Window = policyWindows["AuthPolicy"]; // ✅ single source of truth
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 0;
    });

    options.AddFixedWindowLimiter("OtpPolicy", limiterOptions =>
    {
        limiterOptions.PermitLimit = 1;
        limiterOptions.Window = policyWindows["OtpPolicy"]; // ✅ single source of truth
        limiterOptions.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiterOptions.QueueLimit = 0;
    });
});

// Build the web application
var app = builder.Build();

// Enable Swagger documentation UI in development
app.UseSwagger();
app.UseSwaggerUI();

// Configure middleware pipeline
// app.UseHttpsRedirection(); // Disabled for development
app.UseRouting();
app.UseCors("AllowFrontend"); // Apply CORS policy

// Apply pending database migrations on application startup
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var logger = services.GetRequiredService<ILogger<Program>>();
    var context = services.GetRequiredService<AppDbContext>();

    for (int retries = 0; retries < 10; retries++)
    {
        try
        {
            // This checks for any pending migrations and applies them to whatever 
            // database is defined in your connection string.
            context.Database.Migrate();
            logger.LogInformation("Database migration applied successfully.");
            break;
        }
        catch (Exception)
        {
            if (retries == 9)
            {
                logger.LogError("Could not connect to the database.");
            }   
            else
            {
                logger.LogError("Connecting...");
                await Task.Delay(3000);
            }
        }
    }
}

// Configure additional middleware
app.UseRateLimiter(); // Handle rate limiting
app.UseForwardedHeaders(); // Handle forwarded headers for proxy scenarios
app.UseAuthentication(); // Enable JWT/Cookie authentication
app.UseAuthorization(); // Enable authorization checks

// Map controller endpoints and run the application
app.MapControllers();
app.Run();