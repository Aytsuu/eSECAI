using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace esecai.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class UpdateClassroomEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "class_image",
                table: "Classrooms",
                newName: "class_banner");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "class_banner",
                table: "Classrooms",
                newName: "class_image");
        }
    }
}
