using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace esecai.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class CleanedEntites : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Enrollments");

            migrationBuilder.DropTable(
                name: "Submissions");

            migrationBuilder.DropTable(
                name: "Postings");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Enrollments",
                columns: table => new
                {
                    enroll_id = table.Column<Guid>(type: "uuid", nullable: false),
                    class_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    enroll_created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    enroll_status = table.Column<string>(type: "text", nullable: false, defaultValue: "pending")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Enrollments", x => x.enroll_id);
                    table.ForeignKey(
                        name: "FK_Enrollments_Classrooms_class_id",
                        column: x => x.class_id,
                        principalTable: "Classrooms",
                        principalColumn: "class_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Enrollments_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Postings",
                columns: table => new
                {
                    post_id = table.Column<Guid>(type: "uuid", nullable: false),
                    class_id = table.Column<Guid>(type: "uuid", nullable: false),
                    post_created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    post_details = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false),
                    post_heading = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    post_updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Postings", x => x.post_id);
                    table.ForeignKey(
                        name: "FK_Postings_Classrooms_class_id",
                        column: x => x.class_id,
                        principalTable: "Classrooms",
                        principalColumn: "class_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Submissions",
                columns: table => new
                {
                    sub_id = table.Column<Guid>(type: "uuid", nullable: false),
                    post_id = table.Column<Guid>(type: "uuid", nullable: false),
                    user_id = table.Column<Guid>(type: "uuid", nullable: false),
                    sub_created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    sub_remark = table.Column<string>(type: "text", nullable: false),
                    sub_score = table.Column<float>(type: "real", nullable: false, defaultValue: 0f)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Submissions", x => x.sub_id);
                    table.ForeignKey(
                        name: "FK_Submissions_Postings_post_id",
                        column: x => x.post_id,
                        principalTable: "Postings",
                        principalColumn: "post_id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Submissions_Users_user_id",
                        column: x => x.user_id,
                        principalTable: "Users",
                        principalColumn: "user_id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Enrollments_class_id",
                table: "Enrollments",
                column: "class_id");

            migrationBuilder.CreateIndex(
                name: "IX_Enrollments_user_id",
                table: "Enrollments",
                column: "user_id");

            migrationBuilder.CreateIndex(
                name: "IX_Postings_class_id",
                table: "Postings",
                column: "class_id");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_post_id",
                table: "Submissions",
                column: "post_id");

            migrationBuilder.CreateIndex(
                name: "IX_Submissions_user_id",
                table: "Submissions",
                column: "user_id");
        }
    }
}
