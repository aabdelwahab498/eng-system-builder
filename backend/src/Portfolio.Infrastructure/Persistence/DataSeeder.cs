using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Portfolio.Domain;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence;

public static class DataSeeder
{
    public static async Task SeedAsync(PortfolioDbContext db)
    {
        if (await db.Projects.AnyAsync())
        {
            return; // Data already exists
        }

        var project = new ProjectEntity
        {
            Slug = "eng-system-builder",
            TitleEn = "Engineering System Builder & Software Factory",
            TitleAr = "مصنع البرمجيات وباني الأنظمة الهندسية",
            TaglineEn = "Production-grade portfolio and software engineering architecture ecosystem.",
            Category = ProjectCategory.Web,
            Platform = ["Web", "API", "Cloud"],
            Lifecycle = ProjectStatus.Live,
            RoleEn = "Lead Backend Architect",
            Timeframe = "2026",
            SummaryEn = "Comprehensive engineering ecosystem with React frontend and ASP.NET Core backend.",
            ProblemEn = "Bridging modern frontend UI seams with resilient .NET backend architecture.",
            ApproachEn = "Clean architecture modular monolith with OpenAPI contracts.",
            ArchitectureEn = ["Clean Architecture", "ASP.NET Core", "PostgreSQL EF Core"],
            FeaturesEn = ["Public API", "Health Probes", "OpenAPI", "Structured Logging"],
            Technologies = ["C#", ".NET 8", "PostgreSQL", "React", "TypeScript"],
            OutcomesEn = ["Preserved existing frontend contract", "Established backend foundation"],
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        };

        db.Projects.Add(project);

        var experience = new ExperienceEntity
        {
            Company = "Software Systems Engineering",
            PositionEn = "Lead Software Engineer / Backend Architect",
            PositionAr = "قائد مهندسي البرمجيات ومصمم الأنظمة الخلفية",
            Location = "Remote / On-site",
            StartDate = "2024",
            EndDate = "Present",
            Current = true,
            DescriptionEn = "Designing and implementing resilient backend architectures.",
            ResponsibilitiesEn = [
                "Architecture design & REST API standardization",
                "Database design & EF Core migrations",
                "Continuous integration & containerization"
            ],
            AchievementsEn = [
                "Built modular monolith foundation for portfolio ecosystem"
            ],
            Technologies = ["C#", ".NET 8", "PostgreSQL", "Docker", "REST API"],
            Category = ExperienceCategory.Engineering,
            Status = ContentStatus.Verified,
            PublicVisible = true
        };

        db.Experiences.Add(experience);

        await db.SaveChangesAsync();
    }
}
