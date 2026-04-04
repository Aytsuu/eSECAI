using esecai.Infrastructure.Services;
using Microsoft.Extensions.Logging.Abstractions;
using System.IO;
using Xunit;

namespace esecai.Tests;

public class PdfServiceTests
{
    private readonly PdfService _pdfService;

    public PdfServiceTests()
    {
        _pdfService = new PdfService(new NullLogger<PdfService>());
    }

    [Fact]
    public void ProcessPdf_WithValidInput_GeneratesOutputFile()
    {
        // Arrange
        // The file is copied to the Output Directory at build/run time.
        string inputFilePath = "proposal.pdf";
        string outputDirectory = "TestOutput";
        string outputFilePath = Path.Combine(outputDirectory, "proposal_annotated.pdf");

        // Ensure the input file exists for the test to run
        Assert.True(File.Exists(inputFilePath), $"Test input file not found: {inputFilePath}");

        // Create the output directory if it doesn't exist
        if (!Directory.Exists(outputDirectory))
        {
            Directory.CreateDirectory(outputDirectory);
        }

        // Clean up previous test runs
        if (File.Exists(outputFilePath))
        {
            File.Delete(outputFilePath);
        }
        
        // Act
        using var fileStream = File.OpenRead(inputFilePath);
        var fileBytes = _pdfService.PdfDebugInformation(fileStream);

        // Reset stream position for the next read
        fileStream.Position = 0;

        // Save file to TestOutput
        File.WriteAllBytes(outputFilePath, fileBytes);

        // Assert
        Assert.True(File.Exists(outputFilePath), "The output file was not successfully generated.");
        
        // Assert the generated file is not empty
        var fileInfo = new FileInfo(outputFilePath);
        Assert.True(fileInfo.Length > 0, "The generated output file is empty.");
    }

    [Fact]
    public void FullAssessmentExtraction_WithValidPdf_ReturnsExtractedData()
    {
        // Arrange
        string inputFilePath = "exam.pdf";
        Assert.True(File.Exists(inputFilePath), $"Test input file not found: {inputFilePath}");

        // Act
        using var fileStream = File.OpenRead(inputFilePath);
        
        // 1. Detection
        var presenceResult = _pdfService.DetectTextPresence(fileStream);
        
        // Reset stream position for the next read
        fileStream.Position = 0;

        // 2. Extraction (includes normalization)
        var extractionResult = _pdfService.ExtractFromDigitalPdf(fileStream);

        // 3. Save extracted text to output file
        string outputDirectory = "TestOutput";
        if (!Directory.Exists(outputDirectory))
        {
            Directory.CreateDirectory(outputDirectory);
        }
        string outputFilePath = Path.Combine(outputDirectory, "extracted_assessment.txt");
        File.WriteAllText(outputFilePath, extractionResult.NormalizedText);

        // Assert
        Assert.NotNull(presenceResult);
        Assert.True(presenceResult.TotalPages > 0);
        Assert.True(presenceResult.HasEmbeddedText);
        
        Assert.NotNull(extractionResult);
        Assert.True(extractionResult.TotalPages > 0);
        Assert.NotEmpty(extractionResult.Pages);
        Assert.False(string.IsNullOrWhiteSpace(extractionResult.NormalizedText));
    }
}