using System.Collections.Generic;
using System.Text;

namespace esecai.Application.DTOs;

/// <summary>
/// Result of PDF text presence detection.
/// </summary>
public record PdfTextPresenceResult(
    bool HasEmbeddedText,
    int TotalPages,
    int PagesWithText,
    int TotalWordCount,
    double TextCoverage
);

/// <summary>
/// Full extraction result from a digital PDF.
/// </summary>
public record PdfExtractionResult(
    int TotalPages,
    IReadOnlyList<PdfPageContent> Pages,
    string NormalizedText
);

/// <summary>
/// Content extracted from a single PDF page.
/// </summary>
public record PdfPageContent(
    int PageNumber,
    string PlainText,
    int WordCount,
    bool HasTables
);