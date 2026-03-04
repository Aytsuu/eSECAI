public record EnrollmentDto(
    Guid class_id,
    string class_name,
    string class_description,
    DateTime enrolled_at
);
