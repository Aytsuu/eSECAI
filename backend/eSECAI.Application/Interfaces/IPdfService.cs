using System.IO;
using esecai.Application.DTOs;

namespace esecai.Application.Interfaces;

public interface IPdfService
{
    byte[] PdfDebugInformation(Stream pdfStream);
    PdfTextPresenceResult DetectTextPresence(Stream pdfStream);
    PdfExtractionResult ExtractFromDigitalPdf(Stream pdfStream);
    string NormalizeExtractedText(string raw);
}
