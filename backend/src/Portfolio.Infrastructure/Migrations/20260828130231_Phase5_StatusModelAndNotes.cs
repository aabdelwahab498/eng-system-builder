using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Phase5_StatusModelAndNotes : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "analytics_events",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    EventName = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: true),
                    Path = table.Column<string>(type: "text", nullable: true),
                    SessionId = table.Column<string>(type: "text", nullable: true),
                    MetadataJson = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_analytics_events", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "audit_logs",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    User = table.Column<string>(type: "text", nullable: false),
                    Action = table.Column<string>(type: "text", nullable: false),
                    EntityName = table.Column<string>(type: "text", nullable: false),
                    EntityId = table.Column<string>(type: "text", nullable: true),
                    CorrelationId = table.Column<string>(type: "text", nullable: true),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    UserAgent = table.Column<string>(type: "text", nullable: true),
                    Success = table.Column<bool>(type: "boolean", nullable: false),
                    MetadataJson = table.Column<string>(type: "text", nullable: true),
                    ChangesJson = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_audit_logs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "certifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    NameEn = table.Column<string>(type: "text", nullable: false),
                    NameAr = table.Column<string>(type: "text", nullable: true),
                    Issuer = table.Column<string>(type: "text", nullable: false),
                    IssuedAt = table.Column<string>(type: "text", nullable: true),
                    CredentialUrl = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_certifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "consent_records",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    VisitorId = table.Column<string>(type: "text", nullable: false),
                    AnalyticsConsent = table.Column<bool>(type: "boolean", nullable: false),
                    MarketingConsent = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_consent_records", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "contact_messages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Subject = table.Column<string>(type: "text", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    IpAddress = table.Column<string>(type: "text", nullable: true),
                    StatusState = table.Column<string>(type: "text", nullable: false),
                    AdminNote = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_contact_messages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "courses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    TitleEn = table.Column<string>(type: "text", nullable: false),
                    TitleAr = table.Column<string>(type: "text", nullable: true),
                    Order = table.Column<int>(type: "integer", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_courses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "educations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Institution = table.Column<string>(type: "text", nullable: false),
                    DegreeEn = table.Column<string>(type: "text", nullable: false),
                    DegreeAr = table.Column<string>(type: "text", nullable: true),
                    FieldEn = table.Column<string>(type: "text", nullable: false),
                    FieldAr = table.Column<string>(type: "text", nullable: true),
                    StartDate = table.Column<string>(type: "text", nullable: true),
                    EndDate = table.Column<string>(type: "text", nullable: true),
                    GraduationDate = table.Column<string>(type: "text", nullable: true),
                    DescriptionEn = table.Column<string>(type: "text", nullable: true),
                    DescriptionAr = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_educations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "experiences",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Company = table.Column<string>(type: "text", nullable: false),
                    OrganizationType = table.Column<int>(type: "integer", nullable: false),
                    PositionEn = table.Column<string>(type: "text", nullable: false),
                    PositionAr = table.Column<string>(type: "text", nullable: true),
                    Location = table.Column<string>(type: "text", nullable: true),
                    StartDate = table.Column<string>(type: "text", nullable: true),
                    EndDate = table.Column<string>(type: "text", nullable: true),
                    Current = table.Column<bool>(type: "boolean", nullable: false),
                    DescriptionEn = table.Column<string>(type: "text", nullable: false),
                    DescriptionAr = table.Column<string>(type: "text", nullable: true),
                    ResponsibilitiesEn = table.Column<List<string>>(type: "text[]", nullable: false),
                    ResponsibilitiesAr = table.Column<List<string>>(type: "text[]", nullable: false),
                    AchievementsEn = table.Column<List<string>>(type: "text[]", nullable: false),
                    AchievementsAr = table.Column<List<string>>(type: "text[]", nullable: false),
                    Technologies = table.Column<List<string>>(type: "text[]", nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_experiences", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "products",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    NameEn = table.Column<string>(type: "text", nullable: false),
                    NameAr = table.Column<string>(type: "text", nullable: true),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    Lifecycle = table.Column<int>(type: "integer", nullable: false),
                    TaglineEn = table.Column<string>(type: "text", nullable: false),
                    TaglineAr = table.Column<string>(type: "text", nullable: true),
                    SummaryEn = table.Column<string>(type: "text", nullable: false),
                    SummaryAr = table.Column<string>(type: "text", nullable: true),
                    DescriptionEn = table.Column<string>(type: "text", nullable: false),
                    DescriptionAr = table.Column<string>(type: "text", nullable: true),
                    FeaturesEn = table.Column<List<string>>(type: "text[]", nullable: false),
                    FeaturesAr = table.Column<List<string>>(type: "text[]", nullable: false),
                    Technologies = table.Column<List<string>>(type: "text[]", nullable: false),
                    ExternalUrl = table.Column<string>(type: "text", nullable: true),
                    DemoUrl = table.Column<string>(type: "text", nullable: true),
                    DocsUrl = table.Column<string>(type: "text", nullable: true),
                    RelatedProjectId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_products", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "projects",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Slug = table.Column<string>(type: "text", nullable: false),
                    TitleEn = table.Column<string>(type: "text", nullable: false),
                    TitleAr = table.Column<string>(type: "text", nullable: true),
                    TaglineEn = table.Column<string>(type: "text", nullable: false),
                    TaglineAr = table.Column<string>(type: "text", nullable: true),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    Platform = table.Column<List<string>>(type: "text[]", nullable: false),
                    Lifecycle = table.Column<int>(type: "integer", nullable: false),
                    RoleEn = table.Column<string>(type: "text", nullable: false),
                    RoleAr = table.Column<string>(type: "text", nullable: true),
                    Timeframe = table.Column<string>(type: "text", nullable: true),
                    SummaryEn = table.Column<string>(type: "text", nullable: false),
                    SummaryAr = table.Column<string>(type: "text", nullable: true),
                    ProblemEn = table.Column<string>(type: "text", nullable: false),
                    ProblemAr = table.Column<string>(type: "text", nullable: true),
                    ApproachEn = table.Column<string>(type: "text", nullable: false),
                    ApproachAr = table.Column<string>(type: "text", nullable: true),
                    ArchitectureEn = table.Column<List<string>>(type: "text[]", nullable: false),
                    ArchitectureAr = table.Column<List<string>>(type: "text[]", nullable: false),
                    FeaturesEn = table.Column<List<string>>(type: "text[]", nullable: false),
                    FeaturesAr = table.Column<List<string>>(type: "text[]", nullable: false),
                    Technologies = table.Column<List<string>>(type: "text[]", nullable: false),
                    OutcomesEn = table.Column<List<string>>(type: "text[]", nullable: false),
                    OutcomesAr = table.Column<List<string>>(type: "text[]", nullable: false),
                    RepoUrl = table.Column<string>(type: "text", nullable: true),
                    LiveUrl = table.Column<string>(type: "text", nullable: true),
                    DocsUrl = table.Column<string>(type: "text", nullable: true),
                    ApiUrl = table.Column<string>(type: "text", nullable: true),
                    Featured = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_projects", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "services",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    TitleEn = table.Column<string>(type: "text", nullable: false),
                    TitleAr = table.Column<string>(type: "text", nullable: true),
                    SummaryEn = table.Column<string>(type: "text", nullable: false),
                    SummaryAr = table.Column<string>(type: "text", nullable: true),
                    DescriptionEn = table.Column<string>(type: "text", nullable: false),
                    DescriptionAr = table.Column<string>(type: "text", nullable: true),
                    CapabilitiesEn = table.Column<List<string>>(type: "text[]", nullable: false),
                    CapabilitiesAr = table.Column<List<string>>(type: "text[]", nullable: false),
                    DeliverablesEn = table.Column<List<string>>(type: "text[]", nullable: false),
                    DeliverablesAr = table.Column<List<string>>(type: "text[]", nullable: false),
                    IdealForEn = table.Column<List<string>>(type: "text[]", nullable: false),
                    IdealForAr = table.Column<List<string>>(type: "text[]", nullable: false),
                    RelatedProjects = table.Column<List<string>>(type: "text[]", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_services", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "skill_groups",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    LabelEn = table.Column<string>(type: "text", nullable: false),
                    LabelAr = table.Column<string>(type: "text", nullable: true),
                    DescriptionEn = table.Column<string>(type: "text", nullable: false),
                    DescriptionAr = table.Column<string>(type: "text", nullable: true),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_skill_groups", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "skills",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    SkillGroupId = table.Column<Guid>(type: "uuid", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<int>(type: "integer", nullable: false),
                    ContextEn = table.Column<string>(type: "text", nullable: false),
                    ContextAr = table.Column<string>(type: "text", nullable: true),
                    ProficiencyLabel = table.Column<int>(type: "integer", nullable: true),
                    Emphasis = table.Column<string>(type: "text", nullable: true),
                    Featured = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<int>(type: "integer", nullable: false),
                    SourceType = table.Column<int>(type: "integer", nullable: false),
                    Source = table.Column<string>(type: "text", nullable: true),
                    VerifiedAt = table.Column<DateTimeOffset>(type: "timestamp with time zone", nullable: true),
                    PublicVisible = table.Column<bool>(type: "boolean", nullable: false),
                    PortfolioVisible = table.Column<bool>(type: "boolean", nullable: false),
                    CvVisible = table.Column<bool>(type: "boolean", nullable: false),
                    LinkedinVisible = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_skills", x => x.Id);
                    table.ForeignKey(
                        name: "FK_skills_skill_groups_SkillGroupId",
                        column: x => x.SkillGroupId,
                        principalTable: "skill_groups",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_skills_SkillGroupId",
                table: "skills",
                column: "SkillGroupId");

            migrationBuilder.Sql("UPDATE contact_messages SET \"StatusState\" = 'new' WHERE \"StatusState\" = 'Received';");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "analytics_events");

            migrationBuilder.DropTable(
                name: "audit_logs");

            migrationBuilder.DropTable(
                name: "certifications");

            migrationBuilder.DropTable(
                name: "consent_records");

            migrationBuilder.DropTable(
                name: "contact_messages");

            migrationBuilder.DropTable(
                name: "courses");

            migrationBuilder.DropTable(
                name: "educations");

            migrationBuilder.DropTable(
                name: "experiences");

            migrationBuilder.DropTable(
                name: "products");

            migrationBuilder.DropTable(
                name: "projects");

            migrationBuilder.DropTable(
                name: "services");

            migrationBuilder.DropTable(
                name: "skills");

            migrationBuilder.DropTable(
                name: "skill_groups");
        }
    }
}
