using System;
using System.IO;

namespace esecai.Application.DTOs;

public record AssessmentFileRequest(
    Stream stream,
    string fileName,
    string contentType
);

public record AssessmentData(
  Guid id,
  string title,
  string type,
  string status,
  DateTime createdAt,
  DateTime updatedAt
);