using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace esecai.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RemovedEnrollmentIsApproveAttr : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "enroll_is_approved",
                table: "Enrollments");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "enroll_is_approved",
                table: "Enrollments",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
