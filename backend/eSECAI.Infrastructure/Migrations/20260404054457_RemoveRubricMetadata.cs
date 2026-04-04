using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace esecai.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemoveRubricMetadata : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ass_rubric_meta",
                table: "Assessments");

            migrationBuilder.AddColumn<string>(
                name: "ass_instruction",
                table: "Assessments",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ass_instruction",
                table: "Assessments");

            migrationBuilder.AddColumn<string>(
                name: "ass_rubric_meta",
                table: "Assessments",
                type: "jsonb",
                nullable: false,
                defaultValue: "");
        }
    }
}
