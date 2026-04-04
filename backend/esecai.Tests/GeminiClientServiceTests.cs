using Microsoft.Extensions.Configuration;
using System.IO;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;
using Moq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using esecai.Application.DTOs;
using esecai.Infrastructure.Services;
using Google.GenAI; // Assuming the Google.GenAI SDK allows some level of mocking or this might be an integration test

namespace esecai.Tests;

public class GeminiClientServiceTests
{
    private readonly ITestOutputHelper _output;

    public GeminiClientServiceTests(ITestOutputHelper output)
    {
        _output = output;
    }

    [Fact]
    public async Task GenerateAsync_WithExtractedAssessment_ReturnsText()
    {
        // Arrange
        // Load environment variables from .env file
        DotNetEnv.Env.TraversePath().Load();
        
        var options = Options.Create(new GeminiOptions
        {
            ApiKey = Environment.GetEnvironmentVariable("Gemini__ApiKey") ?? "",
            Model = Environment.GetEnvironmentVariable("Gemini__Model") ?? ""
        });
        
        var loggerMock = new Mock<ILogger<GeminiClientService>>();
        
        // This is more of an integration test if we use the real client.
        // For a unit test, normally the GenAI Client would be mocked or abstracted.
        // Assuming we are doing an integration test structure here that uses the real library
        var service = new GeminiClientService(options, loggerMock.Object);

        string filePath = "TestOutput/extracted_assessment.txt";
        Assert.True(File.Exists(filePath), $"Test input file not found: {filePath}");
        
        var prompt = await File.ReadAllTextAsync(filePath);

        // Act
        var result = await service.GenerateAsync(prompt);

        // Output the result as a .md file
        if (result != null)
        {
            // Pointing directly to the project root directory rather than the bin folder
            string baseDir = AppContext.BaseDirectory;
            string projectRoot = Path.GetFullPath(Path.Combine(baseDir, "..", "..", ".."));
            string outputDirectory = Path.Combine(projectRoot, "TestOutput");
            
            if (!Directory.Exists(outputDirectory))
            {
                Directory.CreateDirectory(outputDirectory);
            }
            
            string outputFilePath = Path.Combine(outputDirectory, "structured_output.json");
            await File.WriteAllTextAsync(outputFilePath, result);
            
            _output.WriteLine($"\nFile successfully saved to: {outputFilePath}");
        }

        // Assert
        Assert.NotNull(result);
    }
}
