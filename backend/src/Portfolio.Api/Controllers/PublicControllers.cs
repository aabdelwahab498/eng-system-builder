using System;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Persistence;

namespace Portfolio.Api.Controllers;

[Route("api/v1/[controller]")]
public class ProfileController : ApiControllerBase
{
    [HttpGet]
    public IActionResult GetProfile()
    {
        var profile = new
        {
            identity = new
            {
                displayName = "Ahmed Abdelwahab",
                professionalName = "Ahmed Abdelwahab",
                shortName = "Ahmed",
                monogram = "AA"
            },
            positioning = new
            {
                primaryTitle = new { en = "Lead Software Engineer & Systems Architect", ar = "قائد مهندسي البرمجيات ومصمم الأنظمة" },
                shortHeadline = new { en = "Building resilient software systems & scalable cloud backends.", ar = "بناء أنظمة برمجية مرنة وخلفيات سحابية قابلة للتوسع." }
            },
            location = new { city = "Cairo", country = "Egypt", remote = true },
            availability = new { state = "open", note = new { en = "Available for engineering leadership & backend architecture contracts.", ar = "متاح لعقود القيادة الهندسية وتصميم الأنظمة الخلفية." } }
        };

        return OkResponse(profile);
    }
}

[Route("api/v1/[controller]")]
public class ExperienceController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;

    public ExperienceController(PortfolioDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetExperience([FromQuery] string? category)
    {
        var query = _db.Experiences.Where(e => e.PublicVisible);
        var items = await query.ToListAsync();

        var dtos = items.Select(e => new ExperienceDto
        {
            Id = e.Id,
            Company = e.Company,
            OrganizationType = e.OrganizationType.ToString().ToLowerInvariant(),
            Position = Locale == "ar" && !string.IsNullOrEmpty(e.PositionAr) ? e.PositionAr : e.PositionEn,
            Location = e.Location,
            StartDate = e.StartDate,
            EndDate = e.EndDate,
            Current = e.Current,
            Description = Locale == "ar" && !string.IsNullOrEmpty(e.DescriptionAr) ? e.DescriptionAr : e.DescriptionEn,
            Responsibilities = Locale == "ar" && e.ResponsibilitiesAr.Count > 0 ? e.ResponsibilitiesAr : e.ResponsibilitiesEn,
            Achievements = Locale == "ar" && e.AchievementsAr.Count > 0 ? e.AchievementsAr : e.AchievementsEn,
            Technologies = e.Technologies,
            Category = e.Category.ToString().ToLowerInvariant()
        }).ToList();

        return OkResponse(dtos);
    }
}

[Route("api/v1/[controller]")]
public class EducationController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;

    public EducationController(PortfolioDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetEducation()
    {
        var items = await _db.Educations.Where(e => e.PublicVisible).ToListAsync();
        var dtos = items.Select(e => new EducationDto
        {
            Id = e.Id,
            Institution = e.Institution,
            Degree = Locale == "ar" && !string.IsNullOrEmpty(e.DegreeAr) ? e.DegreeAr : e.DegreeEn,
            Field = Locale == "ar" && !string.IsNullOrEmpty(e.FieldAr) ? e.FieldAr : e.FieldEn,
            StartDate = e.StartDate,
            EndDate = e.EndDate,
            GraduationDate = e.GraduationDate,
            Description = Locale == "ar" && !string.IsNullOrEmpty(e.DescriptionAr) ? e.DescriptionAr : e.DescriptionEn
        }).ToList();

        return OkResponse(dtos);
    }
}

[Route("api/v1/certifications")]
public class CertificationsController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;

    public CertificationsController(PortfolioDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetCertifications()
    {
        var items = await _db.Certifications.Where(c => c.PublicVisible).ToListAsync();
        var dtos = items.Select(c => new CertificationDto
        {
            Id = c.Id,
            Name = Locale == "ar" && !string.IsNullOrEmpty(c.NameAr) ? c.NameAr : c.NameEn,
            Issuer = c.Issuer,
            IssuedAt = c.IssuedAt,
            CredentialUrl = c.CredentialUrl
        }).ToList();

        return OkResponse(dtos);
    }
}

[Route("api/v1/[controller]")]
public class ProjectsController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;

    public ProjectsController(PortfolioDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects([FromQuery] bool? featured)
    {
        var query = _db.Projects.Where(p => p.PublicVisible);
        if (featured.HasValue && featured.Value)
        {
            query = query.Where(p => p.Featured);
        }

        var items = await query.ToListAsync();
        var dtos = items.Select(MapProject).ToList();
        return OkResponse(dtos);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetProjectBySlug(string slug)
    {
        var item = await _db.Projects.FirstOrDefaultAsync(p => p.Slug == slug && p.PublicVisible);
        if (item == null)
        {
            return FailResponse("NOT_FOUND", $"Project with slug '{slug}' was not found.", statusCode: 404);
        }

        return OkResponse(MapProject(item));
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedProjects()
    {
        var items = await _db.Projects.Where(p => p.PublicVisible && p.Featured).ToListAsync();
        return OkResponse(items.Select(MapProject).ToList());
    }

    private ProjectDto MapProject(ProjectEntity p) => new()
    {
        Id = p.Id,
        Slug = p.Slug,
        Title = Locale == "ar" && !string.IsNullOrEmpty(p.TitleAr) ? p.TitleAr : p.TitleEn,
        Tagline = Locale == "ar" && !string.IsNullOrEmpty(p.TaglineAr) ? p.TaglineAr : p.TaglineEn,
        Category = p.Category.ToString().ToLowerInvariant(),
        Platform = p.Platform,
        Lifecycle = p.Lifecycle.ToString().ToLowerInvariant(),
        Role = Locale == "ar" && !string.IsNullOrEmpty(p.RoleAr) ? p.RoleAr : p.RoleEn,
        Timeframe = p.Timeframe,
        Summary = Locale == "ar" && !string.IsNullOrEmpty(p.SummaryAr) ? p.SummaryAr : p.SummaryEn,
        Problem = Locale == "ar" && !string.IsNullOrEmpty(p.ProblemAr) ? p.ProblemAr : p.ProblemEn,
        Approach = Locale == "ar" && !string.IsNullOrEmpty(p.ApproachAr) ? p.ApproachAr : p.ApproachEn,
        Architecture = Locale == "ar" && p.ArchitectureAr.Count > 0 ? p.ArchitectureAr : p.ArchitectureEn,
        Features = Locale == "ar" && p.FeaturesAr.Count > 0 ? p.FeaturesAr : p.FeaturesEn,
        Technologies = p.Technologies,
        Outcomes = Locale == "ar" && p.OutcomesAr.Count > 0 ? p.OutcomesAr : p.OutcomesEn,
        RepoUrl = p.RepoUrl,
        LiveUrl = p.LiveUrl,
        Featured = p.Featured
    };
}

[Route("api/v1/[controller]")]
public class ContactController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;
    private readonly IValidator<ContactMessageRequest> _validator;

    public ContactController(PortfolioDbContext db, IValidator<ContactMessageRequest> validator)
    {
        _db = db;
        _validator = validator;
    }

    [HttpPost]
    public async Task<IActionResult> SubmitContact([FromBody] ContactMessageRequest request)
    {
        var valResult = await _validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            return FailResponse("VALIDATION_ERROR", "Contact form request is invalid.", errors);
        }

        var entity = new ContactMessageEntity
        {
            Name = request.Name,
            Email = request.Email,
            Subject = request.Subject,
            Message = request.Message,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString()
        };

        _db.ContactMessages.Add(entity);
        await _db.SaveChangesAsync();

        return OkResponse(new { received = true, messageId = entity.Id });
    }
}

[Route("api/v1/analytics/events")]
public class AnalyticsController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;
    private readonly IValidator<AnalyticsEventRequest> _validator;

    public AnalyticsController(PortfolioDbContext db, IValidator<AnalyticsEventRequest> validator)
    {
        _db = db;
        _validator = validator;
    }

    [HttpPost]
    public async Task<IActionResult> RecordEvent([FromBody] AnalyticsEventRequest request)
    {
        var valResult = await _validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            return FailResponse("VALIDATION_ERROR", "Analytics event payload is invalid.", valResult.Errors.Select(e => e.ErrorMessage).ToList());
        }

        var entity = new AnalyticsEventEntity
        {
            EventName = request.EventName,
            Category = request.Category,
            Path = request.Path,
            SessionId = request.SessionId,
            MetadataJson = request.MetadataJson
        };

        _db.AnalyticsEvents.Add(entity);
        await _db.SaveChangesAsync();

        return OkResponse(new { recorded = true, eventId = entity.Id });
    }
}

[Route("api/v1/[controller]")]
public class ConsentController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;
    private readonly IValidator<ConsentRecordRequest> _validator;

    public ConsentController(PortfolioDbContext db, IValidator<ConsentRecordRequest> validator)
    {
        _db = db;
        _validator = validator;
    }

    [HttpPost]
    public async Task<IActionResult> SaveConsent([FromBody] ConsentRecordRequest request)
    {
        var valResult = await _validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            return FailResponse("VALIDATION_ERROR", "Consent payload is invalid.", valResult.Errors.Select(e => e.ErrorMessage).ToList());
        }

        var entity = new ConsentRecordEntity
        {
            VisitorId = request.VisitorId,
            AnalyticsConsent = request.AnalyticsConsent,
            MarketingConsent = request.MarketingConsent
        };

        _db.ConsentRecords.Add(entity);
        await _db.SaveChangesAsync();

        return OkResponse(new { saved = true, visitorId = entity.VisitorId });
    }
}
