using esecai.Application.Interfaces;
using System.Threading.Tasks;
using Google.GenAI;
using Google.GenAI.Types;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;
using esecai.Application.DTOs;

namespace esecai.Infrastructure.Services;

public class GeminiClientService : IGeminiClientService
{   
    private readonly Client _client;
    private readonly GeminiOptions _options;
    private readonly ILogger<GeminiClientService> _logger;

    public GeminiClientService(IOptions<GeminiOptions> options, ILogger<GeminiClientService> logger)
    {
        _options = options.Value;
        _logger = logger;
        
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new ArgumentNullException(nameof(_options.ApiKey), "Gemini ApiKey is missing from configuration.");
        }
        
        _client = new Client(apiKey: _options.ApiKey);
    }

    // ── TEXT-ONLY GENERATION ──────────────────────────────────────────────────
 
    /// <summary>
    /// Sends a structured extraction prompt (plain text) to Gemini.
    /// Used after PdfPig extracts text from a digital PDF — no vision needed.
    /// </summary>
    public async Task<string> GenerateAsync(
        string prompt,
        int maxTokens = 4096,
        CancellationToken ct = default)
    {
        _logger.LogDebug("Gemini text generation: {Chars} chars, model: {Model}",
            prompt.Length, _options.Model);
 
        var config = new GenerateContentConfig
        {
            ResponseMimeType = "application/json", // Forces JSON output — no markdown fences
            Temperature      = 0.1f,               // Near-deterministic for extraction tasks
            MaxOutputTokens  = maxTokens,
            SystemInstruction = new Content 
            { 
                Parts = new List<Part> { new Part { Text = "Extract, analyze, and organize the text, return only a JSON format data." } } 
            }
        };
 
        var response = await _client.Models.GenerateContentAsync(
            model:    _options.Model,
            contents: prompt,
            config:   config);
 
        return ExtractText(response);
    }
 
    // ── FILE UPLOAD + VISION GENERATION ──────────────────────────────────────
 
    /// <summary>
    /// Uploads a PDF/image to the Gemini Files API, then generates content using vision.
    /// Used for scanned exam papers where Gemini must visually interpret the document.
    ///
    /// SDK handles the resumable upload protocol automatically — no manual HTTP needed.
    /// Uploaded files are cached for 48h on Google's servers; consider reusing URIs
    /// if the same scan needs to be processed multiple times (e.g. re-grading).
    /// </summary>
    public async Task<string> GenerateWithFileAsync(
        Stream fileStream,
        string mimeType,
        string prompt,
        int maxTokens = 4096,
        CancellationToken ct = default)
    {
        _logger.LogDebug("Uploading file to Gemini Files API: {MimeType}, {Bytes} bytes",
            mimeType, fileStream.Length);
 
        // Step 1: Upload file via SDK — handles chunked upload internally
        var fileBytes    = await ReadStreamAsync(fileStream, ct);
        var uploadResponse = await _client.Files.UploadAsync(
            bytes:    fileBytes,
            fileName: $"exam_{DateTime.UtcNow:yyyyMMddHHmmss}.pdf");
 
        var fileUri = uploadResponse.Uri;
        _logger.LogInformation("File uploaded to Gemini Files API: {Uri}", fileUri);
 
        // Step 2: Generate content referencing the uploaded file
        var config = new GenerateContentConfig
        {
            ResponseMimeType = "application/json",
            Temperature      = 0.1f,
            MaxOutputTokens  = maxTokens,
            SystemInstruction = new Content 
            { 
                Parts = new List<Part> { new Part { Text = "Your system instructions here." } } 
            }
        };
 
        // Build multimodal content: [file_data, text_prompt]
        var contents = new Content
        {
            Parts = new List<Part>
            {
                new Part
                {
                    FileData = new FileData
                    {
                        MimeType = mimeType,
                        FileUri  = fileUri
                    }
                },
                new Part { Text = prompt }
            }
        };
 
        var response = await _client.Models.GenerateContentAsync(
            model:    _options.Model,
            contents: contents,
            config:   config);
 
        return ExtractText(response);
    }
 
    // ── HELPERS ───────────────────────────────────────────────────────────────
 
    private static string ExtractText(GenerateContentResponse response)
    {
        var text = response.Candidates?[0]?.Content?.Parts?[0]?.Text;
 
        if (string.IsNullOrWhiteSpace(text))
        {
            var reason = response.Candidates?[0]?.FinishReason?.ToString() ?? "unknown";
            throw new InvalidOperationException(
                $"Gemini returned empty response. FinishReason: {reason}");
        }
 
        return text;
    }
 
    private static async Task<byte[]> ReadStreamAsync(Stream stream, CancellationToken ct)
    {
        if (stream is MemoryStream ms) return ms.ToArray();
 
        using var buffer = new MemoryStream();
        await stream.CopyToAsync(buffer, ct);
        return buffer.ToArray();
    } 
}   