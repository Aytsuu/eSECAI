using esecai.Application.Interfaces;
using UglyToad.PdfPig;
using UglyToad.PdfPig.DocumentLayoutAnalysis.PageSegmenter;
using UglyToad.PdfPig.DocumentLayoutAnalysis.ReadingOrderDetector;
using UglyToad.PdfPig.DocumentLayoutAnalysis.WordExtractor;
using UglyToad.PdfPig.DocumentLayoutAnalysis.TextExtractor;
using UglyToad.PdfPig.Fonts.Standard14Fonts;
using UglyToad.PdfPig.Writer;
using Microsoft.Extensions.Logging;
using System.Text;
using System.Text.RegularExpressions;
using esecai.Application.DTOs;

namespace esecai.Infrastructure.Services;

public class PdfService : IPdfService
{

    private const int MinWordsPerPageThreshold = 10;
    private readonly ILogger<PdfService> _logger;

    public PdfService(ILogger<PdfService> logger)
    {
        _logger = logger;
    }

    // ── Debugging Information ────────────────────────────────────────────────────

    public byte[] PdfDebugInformation(Stream pdfStream)
    {
        using (var document = PdfDocument.Open(pdfStream))
        {
            var builder = new PdfDocumentBuilder { };
            PdfDocumentBuilder.AddedFont font = builder.AddStandard14Font(Standard14Font.Helvetica);

            for (int i = 1; i <= document.NumberOfPages; i++)
            {
                var pageBuilder = builder.AddPage(document, i);
                pageBuilder.SetStrokeColor(0, 255, 0);
                var page = document.GetPage(i);

                var letters = page.Letters; // no preprocessing

                // 1. Extract words
                var wordExtractor = NearestNeighbourWordExtractor.Instance;

                var words = wordExtractor.GetWords(letters);

                // 2. Segment page
                var pageSegmenter = DocstrumBoundingBoxes.Instance;

                var textBlocks = pageSegmenter.GetBlocks(words);

                // 3. Postprocessing
                var readingOrder = UnsupervisedReadingOrderDetector.Instance;
                var orderedTextBlocks = readingOrder.Get(textBlocks);

                // 4. Add debug info - Bounding boxes and reading order
                foreach (var block in orderedTextBlocks)
                {
                    var bbox = block.BoundingBox;
                    pageBuilder.DrawRectangle(bbox.BottomLeft, bbox.Width, bbox.Height);
                    pageBuilder.AddText(block.ReadingOrder.ToString(), 8, bbox.TopLeft, font);
                }
            }

            // Write result to a file
            byte[] fileBytes = builder.Build();

            return fileBytes;
        }
    }

    // ── DETECTION ─────────────────────────────────────────────────────────────
 
    public PdfTextPresenceResult DetectTextPresence(Stream pdfStream)
    {
        try
        {
            using var document = PdfDocument.Open(pdfStream);
 
            int totalPages    = document.NumberOfPages;
            int pagesWithText = 0;
            int totalWords    = 0;
 
            foreach (var page in document.GetPages())
            {
                var words = page.GetWords().ToList();
                totalWords += words.Count;
                if (words.Count >= MinWordsPerPageThreshold) pagesWithText++;
            }
 
            double coverage = totalPages > 0 ? (double)pagesWithText / totalPages : 0;
            bool hasText    = coverage > 0.5 && totalWords > MinWordsPerPageThreshold;
 
            _logger.LogInformation(
                "PDF detection: {Pages}p {Words}w {Coverage:P0} → {Decision}",
                totalPages, totalWords, coverage,
                hasText ? "DIGITAL" : "SCANNED");
 
            return new PdfTextPresenceResult(hasText, totalPages, pagesWithText, totalWords, coverage);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "PDF detection failed, defaulting to scanned");
            return new PdfTextPresenceResult(false, 0, 0, 0, 0);
        }
    }
 
    // ── FULL EXTRACTION ───────────────────────────────────────────────────────
 
    public PdfExtractionResult ExtractFromDigitalPdf(Stream pdfStream)
    {
        using var document = PdfDocument.Open(pdfStream);
        var rawText = new StringBuilder();
        var pages   = new List<PdfPageContent>();
 
        foreach (var page in document.GetPages())
        {
            var text      = ContentOrderTextExtractor.GetText(page, true);
            var words     = page.GetWords().ToList();
            bool hasTables = DetectTableHeuristic(words);
 
            var content = new PdfPageContent(page.Number, text, words.Count, hasTables);
            pages.Add(content);
            rawText.AppendLine(text);
        }
 
        return new PdfExtractionResult(
            document.NumberOfPages,
            pages.AsReadOnly(),
            NormalizeExtractedText(rawText.ToString())
        );
    }
 
    // ── NORMALIZATION ─────────────────────────────────────────────────────────
 
    public string NormalizeExtractedText(string raw)
    {
        if (string.IsNullOrWhiteSpace(raw)) return string.Empty;
 
        var text = raw;
        text = NormalizeLigatures(text);

        // Convert isolated numbers (with optional dots) on their own line to [PAGE X] tokens
        text = Regex.Replace(text, @"^\s*(\d+)\.?\s*$", "[PAGE $1]", RegexOptions.Multiline);

        text = Regex.Replace(text, @"[ \t]{2,}", " ");
        text = Regex.Replace(text, @"\n{3,}", "\n\n");
        text = Regex.Replace(text, @"^\s*[^\w\s]\s*$", "", RegexOptions.Multiline);
        text = Regex.Replace(text, @"(?i)^(?:Q(?:uestion)?\s*)?(\d+)[.):\s]", "$1. ", RegexOptions.Multiline);
 
        return text.Trim();
    }
 
    // ── PRIVATE HELPERS ───────────────────────────────────────────────────────
 
    private static bool DetectTableHeuristic(List<UglyToad.PdfPig.Content.Word> words)
    {
        if (words.Count < 6) return false;
        var yGroups = words
            .GroupBy(w => Math.Round(w.BoundingBox.Bottom, 0))
            .Where(g => g.Count() >= 3)
            .ToList();
        return yGroups.Count >= 3;
    }
 
    private static string NormalizeLigatures(string text) => text
        .Replace("\uFB00", "ff").Replace("\uFB01", "fi").Replace("\uFB02", "fl")
        .Replace("\uFB03", "ffi").Replace("\uFB04", "ffl")
        .Replace("\u2019", "'").Replace("\u2018", "'")
        .Replace("\u201C", "\"").Replace("\u201D", "\"")
        .Replace("\u2013", "-").Replace("\u2014", "--");
}