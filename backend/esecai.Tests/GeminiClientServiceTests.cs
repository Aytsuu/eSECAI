using Microsoft.Extensions.Configuration;
using System.IO;
using System.Threading.Tasks;
using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using esecai.Application.DTOs;
using esecai.Infrastructure.Services;
using Google.GenAI; // Assuming the Google.GenAI SDK allows some level of mocking or this might be an integration test

namespace esecai.Tests;

public class GeminiClientServiceTests
{
    [Fact]
    public async Task GenerateAsync_WithExtractedAssessment_ReturnsText()
    {
        // Arrange
        var options = Options.Create(new GeminiOptions
        {
            ApiKey = "AIzaSyD9R09rivzz0v2IvtkmAWwoWo2vawR0nk0",
            Model = "gemini-3-flash-preview"
        });
        
        var loggerMock = new Mock<ILogger<GeminiClientService>>();
        
        // This is more of an integration test if we use the real client.
        // For a unit test, normally the GenAI Client would be mocked or abstracted.
        // Assuming we are doing an integration test structure here that uses the real library
        var service = new GeminiClientService(options, loggerMock.Object);

        string filePath = "TestOutput/extracted_assessment.txt";
        
        // Create a dummy file if it doesn't exist for the test to run
        if (!File.Exists(filePath))
        {
            await File.WriteAllTextAsync(filePath, "Sample extracted assessment text for testing.");
        }
        
        var prompt = await File.ReadAllTextAsync(filePath);

        // Act
        var result = await service.GenerateAsync(prompt);

        // Output the result as a .md file
        if (result != null)
        {
            string outputDirectory = "TestOutput";
            string outputFilePath = Path.Combine(outputDirectory, "extracted_assessment_result.md");
            await File.WriteAllTextAsync(outputFilePath, result);
        }

        // Assert
        Assert.NotNull(result);
    }
}
