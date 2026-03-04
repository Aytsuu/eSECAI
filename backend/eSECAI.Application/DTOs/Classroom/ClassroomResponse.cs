public record ClassroomResponse(
    Guid class_id, 
    string class_name, 
    string class_description, 
    DateTime class_created_at,
    string creator_name,
    string creator_image
);