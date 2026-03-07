namespace eSECAI.Application.Interfaces;

public interface IMinioFileService
{
  Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType);
  Task DeleteFileAsync(string fileUrl);
}