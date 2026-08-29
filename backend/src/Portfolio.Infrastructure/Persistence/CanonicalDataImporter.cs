using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Portfolio.Domain;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence;

public static class CanonicalDataImporter
{
    public static async Task<ImportResult> ImportCanonicalDataAsync(PortfolioDbContext db)
    {
        var result = new ImportResult();

        await ImportProjectsAsync(db, result);
        await ImportExperiencesAsync(db, result);
        await ImportEducationsAsync(db, result);
        await ImportSkillGroupsAsync(db, result);
        await ImportProductsAsync(db, result);
        await ImportServicesAsync(db, result);
        await ImportCoursesAsync(db, result);
        await BackfillContactMessagesAsync(db);
        await SeedDefaultAdminUserAsync(db);

        await db.SaveChangesAsync();
        return result;
    }

    private static async Task SeedDefaultAdminUserAsync(PortfolioDbContext db)
    {
        var adminEmail = Environment.GetEnvironmentVariable("PORTFOLIO_ADMIN_EMAIL") ?? "admin@nextnext-gen.com";
        if (!await db.Users.AnyAsync(u => u.Email == adminEmail))
        {
            var adminPassword = Environment.GetEnvironmentVariable("PORTFOLIO_ADMIN_PASSWORD") ?? "AdminPassword123!";
            db.Users.Add(new UserEntity
            {
                Email = adminEmail,
                PasswordHash = Portfolio.Application.Security.PasswordHasher.HashPassword(adminPassword),
                Role = "admin",
                IsActive = true
            });
        }
    }

    private static async Task BackfillContactMessagesAsync(PortfolioDbContext db)

    {
        var receivedMessages = await db.ContactMessages.Where(c => c.StatusState == "Received").ToListAsync();
        foreach (var msg in receivedMessages)
        {
            msg.StatusState = "new";
        }
    }

    private static async Task ImportProjectsAsync(PortfolioDbContext db, ImportResult result)
    {
        var canonicalProjects = GetCanonicalProjects();
        var existingList = await db.Projects.ToListAsync();
        var existing = existingList.GroupBy(p => p.Slug.ToLower()).ToDictionary(g => g.Key, g => g.First());

        foreach (var p in canonicalProjects)
        {
            if (existing.TryGetValue(p.Slug.ToLower(), out var entity))
            {
                entity.TitleEn = p.TitleEn;
                entity.TitleAr = p.TitleAr;
                entity.TaglineEn = p.TaglineEn;
                entity.TaglineAr = p.TaglineAr;
                entity.Category = p.Category;
                entity.Platform = p.Platform;
                entity.Lifecycle = p.Lifecycle;
                entity.RoleEn = p.RoleEn;
                entity.RoleAr = p.RoleAr;
                entity.SummaryEn = p.SummaryEn;
                entity.SummaryAr = p.SummaryAr;
                entity.ProblemEn = p.ProblemEn;
                entity.ProblemAr = p.ProblemAr;
                entity.ApproachEn = p.ApproachEn;
                entity.ApproachAr = p.ApproachAr;
                entity.ArchitectureEn = p.ArchitectureEn;
                entity.ArchitectureAr = p.ArchitectureAr;
                entity.FeaturesEn = p.FeaturesEn;
                entity.FeaturesAr = p.FeaturesAr;
                entity.Technologies = p.Technologies;
                entity.OutcomesEn = p.OutcomesEn;
                entity.OutcomesAr = p.OutcomesAr;
                entity.RepoUrl = p.RepoUrl;
                entity.LiveUrl = p.LiveUrl;
                entity.Featured = p.Featured;
                entity.Status = p.Status;
                entity.PublicVisible = p.PublicVisible;

                result.UpdatedCount++;
            }
            else
            {
                db.Projects.Add(p);
                result.InsertedCount++;
            }
        }
    }

    private static async Task ImportExperiencesAsync(PortfolioDbContext db, ImportResult result)
    {
        var canonicalExperiences = GetCanonicalExperiences();
        var existing = await db.Experiences.ToListAsync();

        foreach (var exp in canonicalExperiences)
        {
            var match = existing.FirstOrDefault(e => e.Company == exp.Company && e.PositionEn == exp.PositionEn);
            if (match != null)
            {
                match.OrganizationType = exp.OrganizationType;
                match.PositionAr = exp.PositionAr;
                match.Location = exp.Location;
                match.Current = exp.Current;
                match.DescriptionEn = exp.DescriptionEn;
                match.DescriptionAr = exp.DescriptionAr;
                match.ResponsibilitiesEn = exp.ResponsibilitiesEn;
                match.ResponsibilitiesAr = exp.ResponsibilitiesAr;
                match.Technologies = exp.Technologies;
                match.Category = exp.Category;
                match.Status = exp.Status;
                match.PublicVisible = exp.PublicVisible;

                result.UpdatedCount++;
            }
            else
            {
                db.Experiences.Add(exp);
                result.InsertedCount++;
            }
        }
    }

    private static async Task ImportEducationsAsync(PortfolioDbContext db, ImportResult result)
    {
        var canonicalEducations = GetCanonicalEducations();
        var existing = await db.Educations.ToListAsync();

        foreach (var edu in canonicalEducations)
        {
            var match = existing.FirstOrDefault(e => e.Institution == edu.Institution && e.DegreeEn == edu.DegreeEn);
            if (match != null)
            {
                match.FieldEn = edu.FieldEn;
                match.FieldAr = edu.FieldAr;
                match.GraduationDate = edu.GraduationDate;
                match.EndDate = edu.EndDate;
                match.DescriptionEn = edu.DescriptionEn;
                match.Status = edu.Status;
                match.PublicVisible = edu.PublicVisible;

                result.UpdatedCount++;
            }
            else
            {
                db.Educations.Add(edu);
                result.InsertedCount++;
            }
        }
    }

    private static async Task ImportSkillGroupsAsync(PortfolioDbContext db, ImportResult result)
    {
        var canonicalGroups = GetCanonicalSkillGroups();
        var existingGroups = await db.SkillGroups.Include(g => g.Skills).ToListAsync();
        var existing = existingGroups.GroupBy(g => g.Category).ToDictionary(g => g.Key, g => g.First());

        foreach (var group in canonicalGroups)
        {
            if (existing.TryGetValue(group.Category, out var entity))
            {
                entity.LabelEn = group.LabelEn;
                entity.LabelAr = group.LabelAr;
                entity.DescriptionEn = group.DescriptionEn;
                entity.Status = group.Status;
                entity.PublicVisible = group.PublicVisible;

                foreach (var s in group.Skills)
                {
                    var existingSkill = entity.Skills.FirstOrDefault(sk => sk.Name == s.Name);
                    if (existingSkill != null)
                    {
                        existingSkill.ContextEn = s.ContextEn;
                        existingSkill.ContextAr = s.ContextAr;
                        existingSkill.Emphasis = s.Emphasis;
                        existingSkill.Featured = s.Featured;
                        existingSkill.PortfolioVisible = s.PortfolioVisible;
                    }
                    else
                    {
                        entity.Skills.Add(s);
                    }
                }
                result.UpdatedCount++;
            }
            else
            {
                db.SkillGroups.Add(group);
                result.InsertedCount++;
            }
        }
    }

    private static async Task ImportProductsAsync(PortfolioDbContext db, ImportResult result)
    {
        var canonicalProducts = GetCanonicalProducts();
        var existingList = await db.Products.ToListAsync();
        var existing = existingList.GroupBy(p => p.Slug.ToLower()).ToDictionary(g => g.Key, g => g.First());

        foreach (var prod in canonicalProducts)
        {
            if (existing.TryGetValue(prod.Slug.ToLower(), out var entity))
            {
                entity.NameEn = prod.NameEn;
                entity.NameAr = prod.NameAr;
                entity.Category = prod.Category;
                entity.Lifecycle = prod.Lifecycle;
                entity.TaglineEn = prod.TaglineEn;
                entity.SummaryEn = prod.SummaryEn;
                entity.DescriptionEn = prod.DescriptionEn;
                entity.FeaturesEn = prod.FeaturesEn;
                entity.Technologies = prod.Technologies;
                entity.ExternalUrl = prod.ExternalUrl;
                entity.DocsUrl = prod.DocsUrl;
                entity.Status = prod.Status;
                entity.PublicVisible = prod.PublicVisible;

                result.UpdatedCount++;
            }
            else
            {
                db.Products.Add(prod);
                result.InsertedCount++;
            }
        }
    }

    private static async Task ImportServicesAsync(PortfolioDbContext db, ImportResult result)
    {
        var canonicalServices = GetCanonicalServices();
        var existing = await db.Services.ToListAsync();

        foreach (var svc in canonicalServices)
        {
            var match = existing.FirstOrDefault(s => s.TitleEn == svc.TitleEn);
            if (match != null)
            {
                match.SummaryEn = svc.SummaryEn;
                match.DescriptionEn = svc.DescriptionEn;
                match.CapabilitiesEn = svc.CapabilitiesEn;
                match.DeliverablesEn = svc.DeliverablesEn;
                match.IdealForEn = svc.IdealForEn;
                match.Status = svc.Status;
                match.PublicVisible = svc.PublicVisible;

                result.UpdatedCount++;
            }
            else
            {
                db.Services.Add(svc);
                result.InsertedCount++;
            }
        }
    }

    private static async Task ImportCoursesAsync(PortfolioDbContext db, ImportResult result)
    {
        var canonicalCourses = GetCanonicalCourses();
        var existingList = await db.Courses.ToListAsync();
        var existing = existingList.GroupBy(c => c.Slug.ToLower()).ToDictionary(g => g.Key, g => g.First());

        foreach (var crs in canonicalCourses)
        {
            if (existing.TryGetValue(crs.Slug.ToLower(), out var entity))
            {
                entity.TitleEn = crs.TitleEn;
                entity.TitleAr = crs.TitleAr;
                entity.Order = crs.Order;
                entity.Status = crs.Status;
                entity.PublicVisible = crs.PublicVisible;

                result.UpdatedCount++;
            }
            else
            {
                db.Courses.Add(crs);
                result.InsertedCount++;
            }
        }
    }

    public static List<ProjectEntity> GetCanonicalProjects() => [
        new ProjectEntity
        {
            Slug = "nextnext-gen-hub",
            TitleEn = "nextnext-gen.com ecosystem hub",
            TitleAr = "مركز بيئة nextnext-gen.com",
            TaglineEn = "The bilingual root site for a growing product ecosystem.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Designer and engineer",
            SummaryEn = "The root domain of the ecosystem: a bilingual (EN/AR, RTL) portfolio and product hub built on a typed, data-driven content layer.",
            ProblemEn = "Projects, products and professional information were scattered with no single canonical source.",
            ApproachEn = "A typed canonical content layer behind a single access API, with locale-prefixed routes and server-rendered SEO metadata.",
            ArchitectureEn = ["TanStack Start with locale-prefixed routes", "Typed canonical content layer", "Per-route SEO metadata"],
            FeaturesEn = ["Bilingual EN/AR with RTL", "Dark and light themes", "Canonical content architecture"],
            Technologies = ["React", "TypeScript", "Vite", "Tailwind CSS", "shadcn/ui", "TanStack Router"],
            LiveUrl = "https://nextnext-gen.com",
            Featured = false,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "dalil-masry",
            TitleEn = "Dalil Masry — Egyptian Services Directory",
            TitleAr = "دليل مصري — دليل الخدمات المصري",
            TaglineEn = "Arabic-first services directory for Egypt.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "Arabic-first directory uniting services, clinics, shops and professionals across Egypt in one searchable platform.",
            SummaryAr = "دليل عربي يجمع الخدمات والعيادات والمتاجر ومقدّمي الخدمات في مصر داخل منصة واحدة قابلة للبحث.",
            ProblemEn = "Lack of unified search directory for trusted local services.",
            ApproachEn = "Bilingual web directory with Supabase backend and fast search.",
            Technologies = ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
            LiveUrl = "https://dalil-masry-app.lovable.app/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "shifa-travel",
            TitleEn = "Shifa Travel — Medical Tourism Platform",
            TitleAr = "شفاء ترافل — منصة السياحة العلاجية",
            TaglineEn = "Bilingual medical-tourism journey platform.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "Bilingual medical-tourism platform connecting patients with accredited centers, doctors and treatment packages.",
            SummaryAr = "منصة سياحة علاجية ثنائية اللغة تربط المرضى بالمراكز الطبية والأطباء المعتمدين.",
            ProblemEn = "Navigating international medical travel lacks coordination and transparency.",
            ApproachEn = "Patient-centric medical tourism workspace with package booking.",
            Technologies = ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
            LiveUrl = "https://journey-cure-haven.lovable.app/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "wameedh-hub",
            TitleEn = "Wameedh Hub — Learning & Professional Growth Platform",
            TitleAr = "وَمِيد هَب — منصّة التعلّم والتطوير المهني",
            TaglineEn = "Courses, coaching and skill-building in one platform.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "Bilingual educational platform offering courses, services and coaching to help professionals build skills.",
            SummaryAr = "منصة تعليمية ثنائية اللغة تقدّم الكورسات والخدمات والتدريب لمساعدة المهنيين.",
            ProblemEn = "Disjointed tools for online learning, coaching, and career development.",
            ApproachEn = "Integrated LMS and coaching platform.",
            Technologies = ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
            LiveUrl = "https://wameedhhub.com/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "indusb2b",
            TitleEn = "IndusB2B — Industrial B2B Marketplace",
            TitleAr = "IndusB2B — سوق تجاري صناعي B2B",
            TaglineEn = "Arabic-first industrial B2B commerce platform.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "Arabic-first B2B platform for construction materials and industrial tools.",
            SummaryAr = "منصة تجارية B2B عربية لمواد البناء والمعدات الصناعية.",
            ProblemEn = "Inefficient B2B procurement for industrial supplies.",
            ApproachEn = "Digital catalog with supplier comparison and RFQ workflows.",
            Technologies = ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
            LiveUrl = "https://grand-shelf-sync.lovable.app/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "aurea-clinic-os",
            TitleEn = "Aurea Clinic OS — Aesthetic Clinic Management",
            TitleAr = "Aurea Clinic OS — نظام إدارة عيادات التجميل",
            TaglineEn = "Full operations workspace for aesthetic clinics.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "Operations system for aesthetic clinics — CRM, patients, appointments, treatment plans, sessions, billing, campaigns and analytics.",
            SummaryAr = "نظام تشغيلي لعيادات التجميل — إدارة العملاء والمرضى والمواعيد وخطط العلاج والفوترة.",
            ProblemEn = "Aesthetic clinics struggle with fragmented patient session tracking.",
            ApproachEn = "Unified clinic operations OS with medical treatment plan tracking.",
            Technologies = ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Recharts"],
            LiveUrl = "https://clinic-artistry-os.lovable.app/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "maison-parfum",
            TitleEn = "Maison Parfum — Luxury Fragrance E-Commerce",
            TitleAr = "Maison Parfum — متجر عطور فاخرة",
            TaglineEn = "Bilingual luxury fragrance storefront.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "Bilingual luxury fragrance storefront with curated collections, custom perfume builder, and cart flows.",
            SummaryAr = "متجر عطور فاخر ثنائي اللغة بمجموعات منسّقة ومسار لتصميم عطر مخصص.",
            ProblemEn = "Generic e-commerce platforms lack luxury custom fragrance building experiences.",
            ApproachEn = "Tailored e-commerce platform with custom fragrance builder.",
            Technologies = ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
            LiveUrl = "https://perfume-joy-store.lovable.app/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "stockhub",
            TitleEn = "StockHub — Inventory Management System",
            TitleAr = "StockHub — نظام إدارة المخازن",
            TaglineEn = "Arabic-first warehouse and inventory system.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "Arabic-first warehouse and inventory system — product management with pricing, stock movement tracking and smart low-stock alerts.",
            SummaryAr = "نظام مخازن ومخزون عربي — إدارة المنتجات بالأسعار، وتتبع حركات الإدخال والإخراج.",
            ProblemEn = "Manual stock tracking leads to inventory loss and low-stock surprises.",
            ApproachEn = "Real-time inventory workspace with threshold alerts.",
            Technologies = ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
            LiveUrl = "https://prod-warden.lovable.app/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "wameed-os",
            TitleEn = "Wameed OS — CRM & HR Business Operating System",
            TitleAr = "Wameed OS — نظام تشغيل أعمال CRM و HR",
            TaglineEn = "Unified CRM, HR and project operations dashboard.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "Unified business operating system combining CRM pipeline, client management, HR, project tracking, payments, and AI assistant.",
            SummaryAr = "نظام تشغيل أعمال موحّد يجمع CRM وإدارة العملاء وHR وتتبّع المشاريع والدفعات.",
            ProblemEn = "SMEs waste time switching between separate CRM, HR, and accounting tools.",
            ApproachEn = "All-in-one business operating system dashboard.",
            Technologies = ["React", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Vite"],
            LiveUrl = "https://wameed-flow-hub.lovable.app/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "digital-ops-console",
            TitleEn = "Digital Operations Console — Projects, Clients & AI Command Center",
            TitleAr = "Digital Operations Console — مركز قيادة المشاريع والعملاء والذكاء الاصطناعي",
            TaglineEn = "Multi-tenant operations command center.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "Multi-tenant operations command center unifying project, client, infrastructure, automation and AI-solution management.",
            SummaryAr = "مركز قيادة عمليات رقمية متعدد المستأجرين يوحّد إدارة المشاريع والعملاء والبنية التحتية.",
            ProblemEn = "Managing multiple cloud applications and clients requires consolidated telemetry.",
            ApproachEn = "Central command console with JWT auth and containerized deployment.",
            Technologies = ["React", "TypeScript", "Docker", "JWT", "PostgreSQL", "Automation", "AI"],
            LiveUrl = "https://digitaloperations-pro.lovable.app/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "scriptoria-ar",
            TitleEn = "Scriptoria — Arabic AI Creator Studio",
            TitleAr = "Scriptoria — استوديو صناعة المحتوى بالذكاء الاصطناعي",
            TaglineEn = "Arabic-first AI video and script generation studio.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "Arabic-first AI studio that turns a short brief into a ready-to-publish video ad, social reel or YouTube script.",
            SummaryAr = "استوديو ذكاء اصطناعي عربي يحوّل وصفًا قصيرًا إلى إعلان فيديو أو ريل سوشال أو سكربت يوتيوب.",
            ProblemEn = "Lack of dialect-aware Arabic content generation tools for video creators.",
            ApproachEn = "Dialect-aware Arabic LLM studio with TTS and script pipeline.",
            Technologies = ["React", "TypeScript", "Tailwind CSS", "AI", "TTS", "Arabic NLP", "Vite"],
            LiveUrl = "https://scriptoria-ar.lovable.app/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "dev-shield-nexus",
            TitleEn = "DevShield Nexus — AI Software Assurance & DevSecOps",
            TitleAr = "DevShield Nexus — ضمان جودة وأمن البرمجيات بالذكاء الاصطناعي",
            TaglineEn = "AI-powered software assurance pipeline.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "AI software-assurance platform analyzing sites, apps, APIs and source code in one pipeline — AI testing, security analysis, SEO intelligence.",
            SummaryAr = "منصة ضمان برمجيات بالذكاء الاصطناعي تحلّل المواقع والتطبيقات والـ APIs والكود المصدري.",
            ProblemEn = "Software security scans and quality assurance are fragmented across multiple tools.",
            ApproachEn = "Unified AI DevSecOps pipeline with automated security audits.",
            Technologies = ["React", "TypeScript", "Tailwind CSS", "AI", "LLM", "DevSecOps", "GitHub", "Vite"],
            LiveUrl = "https://dev-shield-nexus.lovable.app/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new ProjectEntity
        {
            Slug = "smart-shelf-builder",
            TitleEn = "Smart Shelf Builder — AI Catalog Intelligence",
            TitleAr = "Smart Shelf Builder — ذكاء الكتالوج بالذكاء الاصطناعي",
            TaglineEn = "AI catalog intelligence from legacy files.",
            Category = ProjectCategory.Web,
            Platform = ["web"],
            Lifecycle = ProjectStatus.InDevelopment,
            RoleEn = "Architect and sole engineer",
            RoleAr = "مهندس ومصمم المنصة",
            SummaryEn = "AI catalog-intelligence platform that turns PDFs, spreadsheets and product-image folders into a branded live digital catalog.",
            SummaryAr = "منصة ذكاء كتالوج بالذكاء الاصطناعي تحوّل ملفات PDF وجداول البيانات إلى كتالوج رقمي.",
            ProblemEn = "Converting legacy product PDFs and spreadsheets into live e-commerce catalogs is labor-intensive.",
            ApproachEn = "OCR and LLM pipeline that auto-structures and translates product catalogs.",
            Technologies = ["React", "TypeScript", "Tailwind CSS", "AI", "LLM", "OCR", "Computer Vision", "Vite"],
            LiveUrl = "https://smart-shelf-builder.lovable.app/",
            Featured = true,
            Status = ContentStatus.Verified,
            PublicVisible = true
        }
    ];

    public static List<ExperienceEntity> GetCanonicalExperiences() => [
        new ExperienceEntity
        {
            Company = "Independent / self-directed",
            OrganizationType = OrganizationType.Self,
            PositionEn = "Software Engineer — full-stack, backend and AI systems",
            Location = "Cairo, Egypt",
            Current = true,
            DescriptionEn = "Designs and builds backend services, web and mobile applications, and AI-driven systems, including the Universal AI Software Factory and the Najmah AI story platform.",
            ResponsibilitiesEn = [
                "Design and implement backend services and REST APIs.",
                "Build full-stack web applications with React and TypeScript.",
                "Integrate LLMs, AI agents and automation into product flows.",
                "Deploy and operate services with Docker, Linux and NGINX."
            ],
            Technologies = ["C#", ".NET", "ASP.NET Core", "TypeScript", "React", "Python", "FastAPI", "Flutter", "PostgreSQL", "Docker", "NGINX"],
            Category = ExperienceCategory.Engineering,
            Status = ContentStatus.Draft,
            PublicVisible = true
        },
        new ExperienceEntity
        {
            Company = "Cairo University — Logistics Department",
            OrganizationType = OrganizationType.Academic,
            PositionEn = "Faculty Member",
            Current = false,
            DescriptionEn = "Academic work in the Logistics Department. Duration stated in the old CV as 3 years; exact dates not provided.",
            Category = ExperienceCategory.Academic,
            Status = ContentStatus.NeedsVerification,
            PublicVisible = false
        },
        new ExperienceEntity
        {
            Company = "United Nations (MUNISCA)",
            OrganizationType = OrganizationType.Government,
            PositionEn = "Chief of Logistics",
            Current = false,
            DescriptionEn = "Logistics role. Duration stated in the old CV as 2 years; exact dates not provided.",
            Category = ExperienceCategory.Operations,
            Status = ContentStatus.NeedsVerification,
            PublicVisible = false
        },
        new ExperienceEntity
        {
            Company = "Coop. Company — petroleum field",
            OrganizationType = OrganizationType.Company,
            PositionEn = "Quality Control Specialist",
            Current = false,
            DescriptionEn = "Quality control role in the petroleum field. Duration stated in the old CV as 3 years; exact dates not provided.",
            Category = ExperienceCategory.Operations,
            Status = ContentStatus.NeedsVerification,
            PublicVisible = false
        }
    ];

    public static List<EducationEntity> GetCanonicalEducations() => [
        new EducationEntity
        {
            Institution = "Cairo University",
            DegreeEn = "Bachelor of Engineering",
            FieldEn = "Computer Science",
            GraduationDate = "2016",
            Status = ContentStatus.Draft,
            PublicVisible = true
        },
        new EducationEntity
        {
            Institution = "Issuer not provided",
            DegreeEn = "Diploma in Software Engineering / Back-End Development",
            FieldEn = "Software Engineering",
            EndDate = "2020",
            Status = ContentStatus.NeedsVerification,
            PublicVisible = false
        },
        new EducationEntity
        {
            Institution = "Issuer not provided",
            DegreeEn = "Diploma in Basics of Modern Education",
            FieldEn = "Education",
            EndDate = "2021",
            Status = ContentStatus.NeedsVerification,
            PublicVisible = false
        },
        new EducationEntity
        {
            Institution = "Issuer not provided",
            DegreeEn = "Diploma in Digital Marketing",
            FieldEn = "Digital Marketing",
            EndDate = "2022",
            Status = ContentStatus.NeedsVerification,
            PublicVisible = false
        }
    ];

    public static List<SkillGroupEntity> GetCanonicalSkillGroups() => [
        new SkillGroupEntity
        {
            Category = SkillCategoryId.Backend,
            LabelEn = "Backend",
            LabelAr = "الواجهة الخلفية",
            DescriptionEn = "Services, APIs and data access on the .NET stack.",
            PublicVisible = true,
            Skills = [
                new SkillEntity { Name = "C#", Category = SkillCategoryId.Backend, ContextEn = "Primary backend language.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = ".NET", Category = SkillCategoryId.Backend, ContextEn = "Runtime and framework for backend services.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "ASP.NET Core", Category = SkillCategoryId.Backend, ContextEn = "Used to build HTTP services and APIs.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "Entity Framework Core", Category = SkillCategoryId.Backend, ContextEn = "Data access and migrations in .NET services.", Emphasis = "primary", PortfolioVisible = true },
                new SkillEntity { Name = "REST APIs", Category = SkillCategoryId.Backend, ContextEn = "Designing and implementing resource-based HTTP APIs.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "API Architecture", Category = SkillCategoryId.Backend, ContextEn = "Contracts, versioning and service boundaries.", Emphasis = "primary", PortfolioVisible = true }
            ]
        },
        new SkillGroupEntity
        {
            Category = SkillCategoryId.Frontend,
            LabelEn = "Frontend",
            LabelAr = "الواجهة الأمامية",
            DescriptionEn = "Web interfaces built with React and TypeScript.",
            PublicVisible = true,
            Skills = [
                new SkillEntity { Name = "TypeScript", Category = SkillCategoryId.Frontend, ContextEn = "Default language for web application code.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "JavaScript", Category = SkillCategoryId.Frontend, ContextEn = "Used where TypeScript is not in place.", Emphasis = "supporting", PortfolioVisible = true },
                new SkillEntity { Name = "React", Category = SkillCategoryId.Frontend, ContextEn = "Component model used across web projects.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "Vite", Category = SkillCategoryId.Frontend, ContextEn = "Build tooling for web applications.", Emphasis = "supporting", PortfolioVisible = true },
                new SkillEntity { Name = "HTML", Category = SkillCategoryId.Frontend, ContextEn = "Semantic markup for web interfaces.", Emphasis = "supporting", PortfolioVisible = true },
                new SkillEntity { Name = "CSS", Category = SkillCategoryId.Frontend, ContextEn = "Layout and styling fundamentals.", Emphasis = "supporting", PortfolioVisible = true },
                new SkillEntity { Name = "Tailwind CSS", Category = SkillCategoryId.Frontend, ContextEn = "Utility-first styling in current web projects.", Emphasis = "primary", PortfolioVisible = true },
                new SkillEntity { Name = "Bootstrap", Category = SkillCategoryId.Frontend, ContextEn = "Used in earlier web work.", Emphasis = "supporting", PortfolioVisible = true }
            ]
        },
        new SkillGroupEntity
        {
            Category = SkillCategoryId.Mobile,
            LabelEn = "Mobile",
            LabelAr = "تطبيقات الموبايل",
            DescriptionEn = "Cross-platform mobile applications.",
            PublicVisible = true,
            Skills = [
                new SkillEntity { Name = "Flutter", Category = SkillCategoryId.Mobile, ContextEn = "Cross-platform mobile application development.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "Dart", Category = SkillCategoryId.Mobile, ContextEn = "Language used with Flutter.", Emphasis = "primary", PortfolioVisible = true }
            ]
        },
        new SkillGroupEntity
        {
            Category = SkillCategoryId.Ai,
            LabelEn = "AI Engineering",
            LabelAr = "هندسة الذكاء الاصطناعي",
            DescriptionEn = "LLM integration, agents and automation inside real products.",
            PublicVisible = true,
            Skills = [
                new SkillEntity { Name = "Python", Category = SkillCategoryId.Ai, ContextEn = "Used for AI services and tooling.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "FastAPI", Category = SkillCategoryId.Ai, ContextEn = "HTTP layer for Python AI services.", Emphasis = "primary", PortfolioVisible = true },
                new SkillEntity { Name = "LLM integrations", Category = SkillCategoryId.Ai, ContextEn = "Language models integrated into product flows.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "AI Agents", Category = SkillCategoryId.Ai, ContextEn = "Agent workflows used inside the Factory pipeline.", Emphasis = "primary", PortfolioVisible = true },
                new SkillEntity { Name = "AI Automation", Category = SkillCategoryId.Ai, ContextEn = "Automating multi-step generation and validation work.", Emphasis = "supporting", PortfolioVisible = true },
                new SkillEntity { Name = "AI Orchestration", Category = SkillCategoryId.Ai, ContextEn = "Coordinating multiple AI steps and services.", Emphasis = "supporting", PortfolioVisible = true },
                new SkillEntity { Name = "AI Video Production", Category = SkillCategoryId.Ai, ContextEn = "Producing cartoon episodes and product clips with generative video models.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "Prompt Engineering", Category = SkillCategoryId.Ai, ContextEn = "Writing professional production prompts for text, image and video models.", Emphasis = "primary", Featured = true, PortfolioVisible = true }
            ]
        },
        new SkillGroupEntity
        {
            Category = SkillCategoryId.Business,
            LabelEn = "Growth & Marketing",
            LabelAr = "النمو والتسويق",
            DescriptionEn = "Getting the work in front of the right audience.",
            PublicVisible = true,
            Skills = [
                new SkillEntity { Name = "SEO", Category = SkillCategoryId.Business, ContextEn = "Technical and content SEO for shipped web products.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "Social Media Ads", Category = SkillCategoryId.Business, ContextEn = "Planning and running paid campaigns on Meta, LinkedIn and TikTok.", Emphasis = "primary", PortfolioVisible = true },
                new SkillEntity { Name = "Content Distribution", Category = SkillCategoryId.Business, ContextEn = "Publishing work across code, article, image and video platforms.", Emphasis = "supporting", PortfolioVisible = true }
            ]
        },
        new SkillGroupEntity
        {
            Category = SkillCategoryId.Databases,
            LabelEn = "Databases",
            LabelAr = "قواعد البيانات",
            DescriptionEn = "Relational data modelling and caching.",
            PublicVisible = true,
            Skills = [
                new SkillEntity { Name = "SQL Server", Category = SkillCategoryId.Databases, ContextEn = "Relational database used with .NET services.", Emphasis = "primary", PortfolioVisible = true },
                new SkillEntity { Name = "PostgreSQL", Category = SkillCategoryId.Databases, ContextEn = "Relational database used in current projects.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "Entity Framework Core", Category = SkillCategoryId.Databases, ContextEn = "ORM and migrations layer.", Emphasis = "primary", PortfolioVisible = true },
                new SkillEntity { Name = "Redis", Category = SkillCategoryId.Databases, ContextEn = "Caching and ephemeral state.", Emphasis = "supporting", PortfolioVisible = true }
            ]
        },
        new SkillGroupEntity
        {
            Category = SkillCategoryId.DevOps,
            LabelEn = "DevOps & Infrastructure",
            LabelAr = "البنية التحتية والتشغيل",
            DescriptionEn = "Containerized deployment and operation on Linux.",
            PublicVisible = true,
            Skills = [
                new SkillEntity { Name = "Docker", Category = SkillCategoryId.DevOps, ContextEn = "Containerizing services for deployment.", Emphasis = "primary", Featured = true, PortfolioVisible = true },
                new SkillEntity { Name = "Linux", Category = SkillCategoryId.DevOps, ContextEn = "Host environment for deployed services.", Emphasis = "primary", PortfolioVisible = true },
                new SkillEntity { Name = "NGINX", Category = SkillCategoryId.DevOps, ContextEn = "Reverse proxy and TLS termination.", Emphasis = "primary", PortfolioVisible = true },
                new SkillEntity { Name = "Git", Category = SkillCategoryId.DevOps, ContextEn = "Version control for all work.", Emphasis = "primary", PortfolioVisible = true },
                new SkillEntity { Name = "GitHub", Category = SkillCategoryId.DevOps, ContextEn = "Repository hosting and collaboration.", Emphasis = "supporting", PortfolioVisible = true },
                new SkillEntity { Name = "HTTPS / SSL", Category = SkillCategoryId.DevOps, ContextEn = "Certificates and secure transport for public endpoints.", Emphasis = "supporting", PortfolioVisible = true },
                new SkillEntity { Name = "Reverse Proxy", Category = SkillCategoryId.DevOps, ContextEn = "Routing public traffic to internal services.", Emphasis = "supporting", PortfolioVisible = true },
                new SkillEntity { Name = "Deployment", Category = SkillCategoryId.DevOps, ContextEn = "Releasing and operating services in production.", Emphasis = "supporting", PortfolioVisible = true }
            ]
        },
        new SkillGroupEntity
        {
            Category = SkillCategoryId.Languages,
            LabelEn = "Other Languages & Tools",
            DescriptionEn = "Additional languages and environments used outside the core stack.",
            PublicVisible = true,
            Skills = [
                new SkillEntity { Name = "C++", Category = SkillCategoryId.Languages, ContextEn = "Used in earlier programming work.", Emphasis = "supporting", PortfolioVisible = true },
                new SkillEntity { Name = "Godot", Category = SkillCategoryId.Languages, ContextEn = "Used for game/interactive experiments.", Emphasis = "supporting", PortfolioVisible = true }
            ]
        }
    ];

    public static List<ProductEntity> GetCanonicalProducts() => [
        new ProductEntity
        {
            Slug = "najmah",
            NameEn = "Najmah",
            NameAr = "نجمة",
            Category = ProductCategory.AiTool,
            Lifecycle = ProductStatus.InDevelopment,
            TaglineEn = "Arabic-first AI stories for children.",
            SummaryEn = "A story platform that generates Arabic-first children's stories with social-emotional learning themes.",
            DescriptionEn = "Najmah is the product surface of the Najmah Story Studio project.",
            FeaturesEn = ["Arabic-first story generation", "SEL-oriented themes", "PDF and TXT export"],
            Technologies = ["React", "TypeScript", "NestJS", "Supabase", "Docker"],
            Status = ContentStatus.Draft,
            PublicVisible = true
        },
        new ProductEntity
        {
            Slug = "factory-api",
            NameEn = "Factory API",
            Category = ProductCategory.DeveloperTool,
            Lifecycle = ProductStatus.Live,
            TaglineEn = "The control plane of the Universal AI Software Factory.",
            SummaryEn = "The public API entry point of the Universal AI Software Factory.",
            DescriptionEn = "Factory API exposes the Factory control plane.",
            FeaturesEn = ["Public health endpoint"],
            Technologies = ["Python", "FastAPI", "Docker", "NGINX"],
            ExternalUrl = "https://factory-api.nextnext-gen.com",
            DocsUrl = "https://factory-api.nextnext-gen.com/health",
            Status = ContentStatus.Draft,
            PublicVisible = true
        }
    ];

    public static List<ServiceEntity> GetCanonicalServices() => [
        new ServiceEntity
        {
            TitleEn = "Backend Engineering",
            SummaryEn = "Backend services and APIs built with C#/.NET and ASP.NET Core.",
            DescriptionEn = "Design and implementation of backend services, data models and REST APIs.",
            CapabilitiesEn = ["ASP.NET Core services", "REST API design", "Data modelling with EF Core"],
            DeliverablesEn = ["Backend service", "API contract", "Deployment setup"],
            IdealForEn = ["Products needing a reliable backend", "Teams replacing an ad-hoc API"],
            Status = ContentStatus.Draft,
            PublicVisible = true
        },
        new ServiceEntity
        {
            TitleEn = "Full-Stack Development",
            SummaryEn = "End-to-end web applications with React, TypeScript and a .NET or Python backend.",
            DescriptionEn = "Building complete web applications from data model to interface.",
            CapabilitiesEn = ["React + TypeScript front ends", "Backend integration", "Responsive UIs"],
            DeliverablesEn = ["Working web application", "Source code", "Deployment setup"],
            IdealForEn = ["New products", "Rebuilds of existing web apps"],
            Status = ContentStatus.Draft,
            PublicVisible = true
        },
        new ServiceEntity
        {
            TitleEn = "AI Integration",
            SummaryEn = "LLM features integrated into real product flows, not demos.",
            DescriptionEn = "Integration of language models into existing products: prompt and response handling, structured outputs, and service boundaries around the model.",
            CapabilitiesEn = ["LLM integration", "Structured output handling", "AI service boundaries"],
            DeliverablesEn = ["AI-backed feature", "Service integration"],
            IdealForEn = ["Products adding their first AI feature"],
            Status = ContentStatus.Draft,
            PublicVisible = true
        },
        new ServiceEntity
        {
            TitleEn = "AI Automation & Agents",
            SummaryEn = "Agent and automation workflows around existing systems.",
            DescriptionEn = "Design and implementation of agent workflows and automation pipelines that orchestrate steps across services.",
            CapabilitiesEn = ["Agent workflows", "Task orchestration", "Automation pipelines"],
            DeliverablesEn = ["Automation workflow", "Orchestration service"],
            IdealForEn = ["Repetitive multi-step processes"],
            Status = ContentStatus.Draft,
            PublicVisible = true
        },
        new ServiceEntity
        {
            TitleEn = "API Development",
            SummaryEn = "Versioned, documented APIs with explicit contracts.",
            DescriptionEn = "API design and implementation: resource modelling, contracts, versioning and documentation.",
            CapabilitiesEn = ["REST API design", "API contracts", "Documentation"],
            DeliverablesEn = ["API implementation", "Contract and docs"],
            IdealForEn = ["Products exposing data to clients or partners"],
            Status = ContentStatus.Draft,
            PublicVisible = true
        },
        new ServiceEntity
        {
            TitleEn = "Software Architecture",
            SummaryEn = "System design that stays understandable as the product grows.",
            DescriptionEn = "Architecture work: system decomposition, service boundaries, data flow and deployment topology.",
            CapabilitiesEn = ["System decomposition", "Service boundaries", "Deployment topology"],
            DeliverablesEn = ["Architecture documentation", "Implementation plan"],
            IdealForEn = ["Systems outgrowing their original design"],
            Status = ContentStatus.Draft,
            PublicVisible = true
        },
        new ServiceEntity
        {
            TitleEn = "Digital Product Development",
            SummaryEn = "From problem framing to a shipped digital product.",
            DescriptionEn = "Taking a product idea through scoping, architecture, implementation and deployment as a working digital product.",
            CapabilitiesEn = ["Product scoping", "Implementation", "Deployment and iteration"],
            DeliverablesEn = ["Shipped product", "Source code", "Deployment setup"],
            IdealForEn = ["Founders building a first version"],
            Status = ContentStatus.Draft,
            PublicVisible = true
        }
    ];

    public static List<CourseEntity> GetCanonicalCourses() => [
        new CourseEntity
        {
            Slug = "backend-engineering",
            TitleEn = "Backend Engineering with ASP.NET Core",
            TitleAr = "هندسة الواجهة الخلفية بـ ASP.NET Core",
            Order = 1,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new CourseEntity
        {
            Slug = "ai-llm-integration",
            TitleEn = "AI & LLM Integration",
            TitleAr = "دمج الذكاء الاصطناعي و LLM",
            Order = 2,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new CourseEntity
        {
            Slug = "fullstack-development",
            TitleEn = "Full-Stack Development",
            TitleAr = "التطوير المتكامل Full-Stack",
            Order = 3,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new CourseEntity
        {
            Slug = "api-design",
            TitleEn = "API Design & Contracts",
            TitleAr = "تصميم الواجهات البرمجية والعقود",
            Order = 4,
            Status = ContentStatus.Verified,
            PublicVisible = true
        },
        new CourseEntity
        {
            Slug = "software-architecture",
            TitleEn = "Software Architecture & System Design",
            TitleAr = "معمارية البرمجيات وتصميم الأنظمة",
            Order = 5,
            Status = ContentStatus.Verified,
            PublicVisible = true
        }
    ];
}

public class ImportResult
{
    public int InsertedCount { get; set; }
    public int UpdatedCount { get; set; }
}
