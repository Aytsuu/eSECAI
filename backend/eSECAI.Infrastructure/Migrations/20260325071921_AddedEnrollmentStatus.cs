using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace eSECAI.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddedEnrollmentStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "enroll_status",
                table: "Enrollments",
                type: "text",
                nullable: false,
                defaultValue: "pending");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "enroll_status",
                table: "Enrollments");
        }
    }
}
