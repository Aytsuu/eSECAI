namespace esecai.Application.DTOs;

public class GeminiOptions
{
    public const string SectionName = "Gemini";

    public string ApiKey { get; set; } = string.Empty;
    public string Model { get; set; } = string.Empty;
    public int MaxOutputTokens { get; set; } = 8192;
}