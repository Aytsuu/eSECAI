using Minio;
using Minio.DataModel.Args;
using esecai.Application.Interfaces;

public class MinioFileService : IMinioFileService
{
    private readonly IMinioClient _minioClient;
    private string BucketName = "esecai-uploads";

    public MinioFileService(IMinioClient minioClient)
    {
        _minioClient = minioClient;
    }

    /// <summary>
    ///  Upload file to minio storage
    /// </summary>
    public async Task<string> UploadFileAsync(Stream fileStream, string fileName, string contentType)
    {
        var beArgs = new BucketExistsArgs().WithBucket(BucketName);
        if (!await _minioClient.BucketExistsAsync(beArgs))
        {
            await _minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(BucketName));
        }

        // 2. Upload the file with a unique name
        var uniqueFileName = $"{Guid.NewGuid()}_{fileName}";
        
        var putObjectArgs = new PutObjectArgs()
            .WithBucket(BucketName)
            .WithObject(uniqueFileName)
            .WithStreamData(fileStream)
            .WithObjectSize(fileStream.Length)
            .WithContentType(contentType);

        await _minioClient.PutObjectAsync(putObjectArgs);

        // 3. Return the relative path/URL to be stored in the DB
        return $"{BucketName}/{uniqueFileName}";
    }

    /// <summary>
    /// Delete file from minio storage
    /// </summary>
    /// <param name="fileUrl">Takes the file path</param>
    public async Task DeleteFileAsync(string fileUrl)
    {
        var objectName = fileUrl.Split('/').Last();
        var args = new RemoveObjectArgs().WithBucket(BucketName).WithObject(objectName);
        await _minioClient.RemoveObjectAsync(args);
    }
}