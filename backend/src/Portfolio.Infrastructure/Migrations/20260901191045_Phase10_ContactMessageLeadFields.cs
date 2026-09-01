using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Phase10_ContactMessageLeadFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AttachmentUrl",
                table: "contact_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Budget",
                table: "contact_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Locale",
                table: "contact_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Platform",
                table: "contact_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreferredChannel",
                table: "contact_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ProjectName",
                table: "contact_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Scope",
                table: "contact_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ServiceId",
                table: "contact_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ServiceTitle",
                table: "contact_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Timeline",
                table: "contact_messages",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Whatsapp",
                table: "contact_messages",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AttachmentUrl",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "Budget",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "Locale",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "Platform",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "PreferredChannel",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "ProjectName",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "Scope",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "ServiceId",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "ServiceTitle",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "Timeline",
                table: "contact_messages");

            migrationBuilder.DropColumn(
                name: "Whatsapp",
                table: "contact_messages");
        }
    }
}
