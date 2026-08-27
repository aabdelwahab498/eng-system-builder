using System;
using System.Collections.Generic;
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
            TaglineAr = "بيئة هندسة برمجية وحقيبة أعمال متكاملة عالية الجودة.",
            Category = ProjectCategory.Web,
            Platform = ["Web", "API", "Cloud"],
            Lifecycle = ProjectStatus.Live,
            RoleEn = "Lead Backend Architect",
            RoleAr = "قائد مهندسي البرمجيات",
            Timeframe = "2026",
            SummaryEn = "Comprehensive engineering ecosystem with React frontend and ASP.NET Core backend.",
            SummaryAr = "بيئة هندسية متكاملة بجهة أمامية واجهة React وخلفية ASP.NET Core.",
            ProblemEn = "Bridging modern frontend UI seams with resilient .NET backend architecture.",
            ProblemAr = "ربط الواجهات الحديثة ببنية خلفية مرنة باستخدام .NET.",
            ApproachEn = "Clean architecture modular monolith with OpenAPI contracts.",
            ApproachAr = "بنية أحادية موديولية منظمة مع عقود OpenAPI.",
            ArchitectureEn = ["Clean Architecture", "ASP.NET Core", "PostgreSQL EF Core"],
            ArchitectureAr = ["البنية النظيفة", "ASP.NET Core", "EF Core مع PostgreSQL"],
            FeaturesEn = ["Public API", "Health Probes", "OpenAPI", "Structured Logging"],
            FeaturesAr = ["واجهات برمجة عامة", "فحوصات السلامة", "OpenAPI", "تسجيل أحداث منظم"],
            Technologies = ["C#", ".NET 8", "PostgreSQL", "React", "TypeScript"],
            OutcomesEn = ["Preserved existing frontend contract", "Established backend foundation"],
            OutcomesAr = ["الحفاظ على عقد الواجهة الأمامية", "تأسيس البنية الخلفية"],
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
            DescriptionAr = "تصميم وتطوير بنيات خلفية مرنة وموثوقة.",
            ResponsibilitiesEn = [
                "Architecture design & REST API standardization",
                "Database design & EF Core migrations",
                "Continuous integration & containerization"
            ],
            ResponsibilitiesAr = [
                "تصميم البنية الهندسية وتوحيد واجهات REST API",
                "تصميم قواعد البيانات وترحيل EF Core",
                "التكامل المستمر والحاوية"
            ],
            AchievementsEn = [
                "Built modular monolith foundation for portfolio ecosystem"
            ],
            AchievementsAr = [
                "بناء البنية الأساسية للأنظمة الخلفية لحقيبة الأعمال"
            ],
            Technologies = ["C#", ".NET 8", "PostgreSQL", "Docker", "REST API"],
            Category = ExperienceCategory.Engineering,
            Status = ContentStatus.Verified,
            PublicVisible = true
        };

        db.Experiences.Add(experience);

        var education = new EducationEntity
        {
            Institution = "Faculty of Engineering",
            DegreeEn = "Bachelor of Science in Engineering",
            DegreeAr = "بكالوريوس الهندسة",
            FieldEn = "Computer Systems & Software Engineering",
            FieldAr = "هندسة الحاسبات والبرمجيات",
            GraduationDate = "2023",
            DescriptionEn = "Specialized in distributed systems, backend architecture, and software design.",
            DescriptionAr = "تخصص في الأنظمة الموزعة، هندسة البرمجيات والتصميم المعماري.",
            Status = ContentStatus.Verified,
            PublicVisible = true
        };

        db.Educations.Add(education);

        var certification = new CertificationEntity
        {
            NameEn = "Microsoft Certified: DevOps Engineer Expert",
            NameAr = "خبير مهندس DevOps معتمد من مايكروسوفت",
            Issuer = "Microsoft",
            IssuedAt = "2024",
            CredentialUrl = "https://learn.microsoft.com/credentials",
            Status = ContentStatus.Verified,
            PublicVisible = true
        };

        db.Certifications.Add(certification);

        var skillGroup = new SkillGroupEntity
        {
            Category = SkillCategoryId.Backend,
            LabelEn = "Backend & Systems Architecture",
            LabelAr = "هندسة الأنظمة والبرمجيات الخلفية",
            DescriptionEn = "Core architecture stack for high-throughput, secure microservices and monoliths.",
            DescriptionAr = "التقنيات الأساسية لبناء خوادم برمجية آمنة وعالية الأداء.",
            Skills = [
                new SkillEntity
                {
                    Name = "C# / ASP.NET Core",
                    Category = SkillCategoryId.Backend,
                    ContextEn = "Primary stack for enterprise REST APIs and domain modeling.",
                    ContextAr = "البيئة الأساسية لبناء واجهات البرمجة والأنظمة الخلفية.",
                    ProficiencyLabel = ProficiencyLabel.Primary,
                    Emphasis = "primary",
                    Featured = true,
                    PortfolioVisible = true,
                    Status = ContentStatus.Verified,
                    PublicVisible = true
                },
                new SkillEntity
                {
                    Name = "PostgreSQL & EF Core",
                    Category = SkillCategoryId.Databases,
                    ContextEn = "Relational database design, migrations, and query optimization.",
                    ContextAr = "تصميم قواعد البيانات والترحيل وتحسين الاستعلامات.",
                    ProficiencyLabel = ProficiencyLabel.Production,
                    Emphasis = "primary",
                    Featured = true,
                    PortfolioVisible = true,
                    Status = ContentStatus.Verified,
                    PublicVisible = true
                }
            ],
            Status = ContentStatus.Verified,
            PublicVisible = true
        };

        db.SkillGroups.Add(skillGroup);

        var service = new ServiceEntity
        {
            TitleEn = "Backend Architecture & REST API Development",
            TitleAr = "تصميم الأنظمة الخلفية وتطوير واجهات البرمجة",
            SummaryEn = "Designing resilient .NET modular monoliths & microservices.",
            SummaryAr = "تصميم وتطوير بنيات خلفية متكاملة باستخدام .NET.",
            DescriptionEn = "End-to-end backend architecture design, EF Core persistence, OpenAPI documentation, and deployment.",
            DescriptionAr = "خدمة شاملة لتصميم وبناء الخوادم وقواعد البيانات وتوثيق API.",
            CapabilitiesEn = ["Domain-Driven Design", "REST API Versioning", "PostgreSQL Optimization"],
            CapabilitiesAr = ["التصميم الموجه للمجال", "إصدار واجهات API", "تحسين قواعد البيانات"],
            DeliverablesEn = ["Production C# backend repository", "OpenAPI Specification", "Docker Compose setup"],
            DeliverablesAr = ["مستودع كود C# جاهز للإنتاج", "مواصفات OpenAPI", "إعداد Docker Compose"],
            IdealForEn = ["Startups needing a robust backend foundation", "Enterprise API migrations"],
            IdealForAr = ["الشركات الناشئة", "المشاريع الراغبة في تطوير واجهاتها الخلفية"],
            Status = ContentStatus.Verified,
            PublicVisible = true
        };

        db.Services.Add(service);

        var product = new ProductEntity
        {
            Slug = "backend-starter-kit",
            NameEn = "ASP.NET Core Clean Architecture Starter Kit",
            NameAr = "حزمة البداية الهندسية لبنية ASP.NET Core النظيفة",
            Category = ProductCategory.DeveloperTool,
            Lifecycle = ProductStatus.Live,
            TaglineEn = "Production-ready C# modular monolith template.",
            TaglineAr = "قالب جاهز للإنتاج لبناء الأنظمة الخلفية بلغة C#.",
            SummaryEn = "Pre-configured .NET 8 template with EF Core, Serilog, Swagger, and FluentValidation.",
            SummaryAr = "قالب جاهز يحتوي على إعدادات قواعد البيانات، التسجيل، والتوثيق.",
            DescriptionEn = "Accelerate backend development with pre-built authentication, audit logging, and Docker configs.",
            DescriptionAr = "تسريع تطوير الأنظمة الخلفية بفضل الإعدادات المسبقة للتسجيل والأمان.",
            FeaturesEn = ["Clean Architecture Layers", "Standardized Response Envelope", "Docker Support"],
            FeaturesAr = ["طبقات البنية النظيفة", "هيكل استجابة موحد", "دعم كامل لـ Docker"],
            Technologies = ["C#", ".NET 8", "EF Core", "Docker"],
            Status = ContentStatus.Verified,
            PublicVisible = true
        };

        db.Products.Add(product);

        var course = new CourseEntity
        {
            Slug = "dotnet-backend-mastery",
            TitleEn = "Building Production-Grade ASP.NET Core Backends",
            TitleAr = "احتراف بناء الأنظمة الخلفية بـ ASP.NET Core",
            Order = 1,
            Url = "https://github.com/aabdelwahab498/eng-system-builder",
            Status = ContentStatus.Verified,
            PublicVisible = true
        };

        db.Courses.Add(course);

        await db.SaveChangesAsync();
    }
}
