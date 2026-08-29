using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs;
using Portfolio.Domain;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Persistence;

namespace Portfolio.Api.Controllers;

public class UploadMediaAssetRequest
{
    public required Microsoft.AspNetCore.Http.IFormFile File { get; set; }
    public string? AltEn { get; set; }
    public string? AltAr { get; set; }
    public string? CaptionEn { get; set; }
    public string? CaptionAr { get; set; }
}

[Route("api/v1/admin")]
[ApiController]
[Authorize(Policy = "Administrator")]
public class AdminController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;

    public AdminController(PortfolioDbContext db)
    {
        _db = db;
    }

    private string GetActorId()
    {
        return User.FindFirstValue(ClaimTypes.NameIdentifier)
               ?? User.FindFirstValue("sub")
               ?? "unknown-admin";
    }

    private async Task LogAuditAsync(string action, string entityName, string? entityId, bool success = true, string? metadataJson = null)
    {
        var auditLog = new AuditLogEntity
        {
            User = GetActorId(),
            Action = action,
            EntityName = entityName,
            EntityId = entityId,
            CorrelationId = HttpContext.TraceIdentifier,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
            UserAgent = Request.Headers["User-Agent"].ToString(),
            Success = success,
            MetadataJson = metadataJson
        };
        _db.AuditLogs.Add(auditLog);
        await _db.SaveChangesAsync();
    }

    #region Audit Logs
    [HttpGet("audit-logs")]
    public async Task<IActionResult> GetAuditLogs()
    {
        var logs = await _db.AuditLogs.AsNoTracking().OrderByDescending(x => x.CreatedAt).ToListAsync();
        return OkResponse(logs);
    }
    #endregion

    #region Projects CMS
    [HttpGet("projects")]
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _db.Projects.AsNoTracking().ToListAsync();
        return OkResponse(projects);
    }

    [HttpGet("projects/{id:guid}")]
    public async Task<IActionResult> GetProjectById(Guid id)
    {
        var project = await _db.Projects.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (project == null) return FailResponse("PROJECT_NOT_FOUND", $"Project with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(project);
    }

    [HttpPost("projects")]
    public async Task<IActionResult> CreateProject([FromBody] AdminProjectRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Slug) || string.IsNullOrWhiteSpace(request.TitleEn))
        {
            await LogAuditAsync("CREATE_PROJECT_FAILED", nameof(ProjectEntity), null, false, "{\"reason\":\"missing_required_fields\"}");
            return FailResponse("INVALID_PAYLOAD", "Slug and TitleEn are required.", statusCode: 400);
        }

        var exists = await _db.Projects.AnyAsync(x => x.Slug.ToLower() == request.Slug.ToLower());
        if (exists)
        {
            await LogAuditAsync("CREATE_PROJECT_FAILED", nameof(ProjectEntity), null, false, $"{{\"slug\":\"{request.Slug}\",\"reason\":\"duplicate_slug\"}}");
            return FailResponse("DUPLICATE_SLUG", $"A project with slug '{request.Slug}' already exists.", statusCode: 409);
        }

        var project = new ProjectEntity
        {
            Slug = request.Slug,
            TitleEn = request.TitleEn,
            TitleAr = request.TitleAr,
            TaglineEn = request.TaglineEn,
            TaglineAr = request.TaglineAr,
            Category = request.Category,
            Platform = request.Platform,
            Lifecycle = request.Lifecycle,
            RoleEn = request.RoleEn,
            RoleAr = request.RoleAr,
            Timeframe = request.Timeframe,
            SummaryEn = request.SummaryEn,
            SummaryAr = request.SummaryAr,
            ProblemEn = request.ProblemEn,
            ProblemAr = request.ProblemAr,
            ApproachEn = request.ApproachEn,
            ApproachAr = request.ApproachAr,
            ArchitectureEn = request.ArchitectureEn,
            ArchitectureAr = request.ArchitectureAr,
            FeaturesEn = request.FeaturesEn,
            FeaturesAr = request.FeaturesAr,
            Technologies = request.Technologies,
            OutcomesEn = request.OutcomesEn,
            OutcomesAr = request.OutcomesAr,
            RepoUrl = request.RepoUrl,
            LiveUrl = request.LiveUrl,
            DocsUrl = request.DocsUrl,
            ApiUrl = request.ApiUrl,
            Featured = request.Featured,
            PublicVisible = request.PublicVisible
        };

        _db.Projects.Add(project);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CREATE_PROJECT", nameof(ProjectEntity), project.Id.ToString(), true, $"{{\"slug\":\"{project.Slug}\"}}");
        return StatusCode(201, ApiResponse<ProjectEntity>.Ok(project));
    }

    [HttpPut("projects/{id:guid}")]
    public async Task<IActionResult> UpdateProject(Guid id, [FromBody] AdminProjectRequest request)
    {
        var project = await _db.Projects.FirstOrDefaultAsync(x => x.Id == id);
        if (project == null) return FailResponse("PROJECT_NOT_FOUND", $"Project with ID '{id}' was not found.", statusCode: 404);

        var slugConflict = await _db.Projects.AnyAsync(x => x.Id != id && x.Slug.ToLower() == request.Slug.ToLower());
        if (slugConflict)
        {
            await LogAuditAsync("UPDATE_PROJECT_FAILED", nameof(ProjectEntity), id.ToString(), false, $"{{\"slug\":\"{request.Slug}\",\"reason\":\"duplicate_slug\"}}");
            return FailResponse("DUPLICATE_SLUG", $"A project with slug '{request.Slug}' already exists.", statusCode: 409);
        }

        project.Slug = request.Slug;
        project.TitleEn = request.TitleEn;
        project.TitleAr = request.TitleAr;
        project.TaglineEn = request.TaglineEn;
        project.TaglineAr = request.TaglineAr;
        project.Category = request.Category;
        project.Platform = request.Platform;
        project.Lifecycle = request.Lifecycle;
        project.RoleEn = request.RoleEn;
        project.RoleAr = request.RoleAr;
        project.Timeframe = request.Timeframe;
        project.SummaryEn = request.SummaryEn;
        project.SummaryAr = request.SummaryAr;
        project.ProblemEn = request.ProblemEn;
        project.ProblemAr = request.ProblemAr;
        project.ApproachEn = request.ApproachEn;
        project.ApproachAr = request.ApproachAr;
        project.ArchitectureEn = request.ArchitectureEn;
        project.ArchitectureAr = request.ArchitectureAr;
        project.FeaturesEn = request.FeaturesEn;
        project.FeaturesAr = request.FeaturesAr;
        project.Technologies = request.Technologies;
        project.OutcomesEn = request.OutcomesEn;
        project.OutcomesAr = request.OutcomesAr;
        project.RepoUrl = request.RepoUrl;
        project.LiveUrl = request.LiveUrl;
        project.DocsUrl = request.DocsUrl;
        project.ApiUrl = request.ApiUrl;
        project.Featured = request.Featured;
        project.PublicVisible = request.PublicVisible;
        project.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UPDATE_PROJECT", nameof(ProjectEntity), project.Id.ToString(), true, $"{{\"slug\":\"{project.Slug}\"}}");
        return OkResponse(project);
    }

    [HttpDelete("projects/{id:guid}")]
    public async Task<IActionResult> DeleteProject(Guid id)
    {
        var project = await _db.Projects.FirstOrDefaultAsync(x => x.Id == id);
        if (project == null) return FailResponse("PROJECT_NOT_FOUND", $"Project with ID '{id}' was not found.", statusCode: 404);

        _db.Projects.Remove(project);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DELETE_PROJECT", nameof(ProjectEntity), id.ToString(), true, $"{{\"slug\":\"{project.Slug}\"}}");
        return StatusCode(204);
    }
    #endregion

    #region Experience CMS
    [HttpGet("experience")]
    public async Task<IActionResult> GetExperiences()
    {
        var experiences = await _db.Experiences.AsNoTracking().ToListAsync();
        return OkResponse(experiences);
    }

    [HttpGet("experience/{id:guid}")]
    public async Task<IActionResult> GetExperienceById(Guid id)
    {
        var exp = await _db.Experiences.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (exp == null) return FailResponse("EXPERIENCE_NOT_FOUND", $"Experience with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(exp);
    }

    [HttpPost("experience")]
    public async Task<IActionResult> CreateExperience([FromBody] AdminExperienceRequest request)
    {
        var exp = new ExperienceEntity
        {
            Company = request.Company,
            OrganizationType = request.OrganizationType,
            PositionEn = request.PositionEn,
            PositionAr = request.PositionAr,
            Location = request.Location,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Current = request.Current,
            DescriptionEn = request.DescriptionEn,
            DescriptionAr = request.DescriptionAr,
            ResponsibilitiesEn = request.ResponsibilitiesEn,
            ResponsibilitiesAr = request.ResponsibilitiesAr,
            AchievementsEn = request.AchievementsEn,
            AchievementsAr = request.AchievementsAr,
            Technologies = request.Technologies,
            Category = request.Category,
            PublicVisible = request.PublicVisible
        };

        _db.Experiences.Add(exp);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CREATE_EXPERIENCE", nameof(ExperienceEntity), exp.Id.ToString(), true, $"{{\"company\":\"{exp.Company}\"}}");
        return StatusCode(201, ApiResponse<ExperienceEntity>.Ok(exp));
    }

    [HttpPut("experience/{id:guid}")]
    public async Task<IActionResult> UpdateExperience(Guid id, [FromBody] AdminExperienceRequest request)
    {
        var exp = await _db.Experiences.FirstOrDefaultAsync(x => x.Id == id);
        if (exp == null) return FailResponse("EXPERIENCE_NOT_FOUND", $"Experience with ID '{id}' was not found.", statusCode: 404);

        exp.Company = request.Company;
        exp.OrganizationType = request.OrganizationType;
        exp.PositionEn = request.PositionEn;
        exp.PositionAr = request.PositionAr;
        exp.Location = request.Location;
        exp.StartDate = request.StartDate;
        exp.EndDate = request.EndDate;
        exp.Current = request.Current;
        exp.DescriptionEn = request.DescriptionEn;
        exp.DescriptionAr = request.DescriptionAr;
        exp.ResponsibilitiesEn = request.ResponsibilitiesEn;
        exp.ResponsibilitiesAr = request.ResponsibilitiesAr;
        exp.AchievementsEn = request.AchievementsEn;
        exp.AchievementsAr = request.AchievementsAr;
        exp.Technologies = request.Technologies;
        exp.Category = request.Category;
        exp.PublicVisible = request.PublicVisible;
        exp.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UPDATE_EXPERIENCE", nameof(ExperienceEntity), exp.Id.ToString(), true, $"{{\"company\":\"{exp.Company}\"}}");
        return OkResponse(exp);
    }

    [HttpDelete("experience/{id:guid}")]
    public async Task<IActionResult> DeleteExperience(Guid id)
    {
        var exp = await _db.Experiences.FirstOrDefaultAsync(x => x.Id == id);
        if (exp == null) return FailResponse("EXPERIENCE_NOT_FOUND", $"Experience with ID '{id}' was not found.", statusCode: 404);

        _db.Experiences.Remove(exp);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DELETE_EXPERIENCE", nameof(ExperienceEntity), id.ToString(), true, $"{{\"company\":\"{exp.Company}\"}}");
        return StatusCode(204);
    }
    #endregion

    #region Education CMS
    [HttpGet("education")]
    public async Task<IActionResult> GetEducation()
    {
        var edu = await _db.Educations.AsNoTracking().ToListAsync();
        return OkResponse(edu);
    }

    [HttpGet("education/{id:guid}")]
    public async Task<IActionResult> GetEducationById(Guid id)
    {
        var edu = await _db.Educations.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (edu == null) return FailResponse("EDUCATION_NOT_FOUND", $"Education with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(edu);
    }

    [HttpPost("education")]
    public async Task<IActionResult> CreateEducation([FromBody] AdminEducationRequest request)
    {
        var edu = new EducationEntity
        {
            Institution = request.Institution,
            DegreeEn = request.DegreeEn,
            DegreeAr = request.DegreeAr,
            FieldEn = request.FieldEn,
            FieldAr = request.FieldAr,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            GraduationDate = request.GraduationDate,
            DescriptionEn = request.DescriptionEn,
            DescriptionAr = request.DescriptionAr,
            PublicVisible = request.PublicVisible
        };

        _db.Educations.Add(edu);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CREATE_EDUCATION", nameof(EducationEntity), edu.Id.ToString(), true, $"{{\"institution\":\"{edu.Institution}\"}}");
        return StatusCode(201, ApiResponse<EducationEntity>.Ok(edu));
    }

    [HttpPut("education/{id:guid}")]
    public async Task<IActionResult> UpdateEducation(Guid id, [FromBody] AdminEducationRequest request)
    {
        var edu = await _db.Educations.FirstOrDefaultAsync(x => x.Id == id);
        if (edu == null) return FailResponse("EDUCATION_NOT_FOUND", $"Education with ID '{id}' was not found.", statusCode: 404);

        edu.Institution = request.Institution;
        edu.DegreeEn = request.DegreeEn;
        edu.DegreeAr = request.DegreeAr;
        edu.FieldEn = request.FieldEn;
        edu.FieldAr = request.FieldAr;
        edu.StartDate = request.StartDate;
        edu.EndDate = request.EndDate;
        edu.GraduationDate = request.GraduationDate;
        edu.DescriptionEn = request.DescriptionEn;
        edu.DescriptionAr = request.DescriptionAr;
        edu.PublicVisible = request.PublicVisible;
        edu.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UPDATE_EDUCATION", nameof(EducationEntity), edu.Id.ToString(), true, $"{{\"institution\":\"{edu.Institution}\"}}");
        return OkResponse(edu);
    }

    [HttpDelete("education/{id:guid}")]
    public async Task<IActionResult> DeleteEducation(Guid id)
    {
        var edu = await _db.Educations.FirstOrDefaultAsync(x => x.Id == id);
        if (edu == null) return FailResponse("EDUCATION_NOT_FOUND", $"Education with ID '{id}' was not found.", statusCode: 404);

        _db.Educations.Remove(edu);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DELETE_EDUCATION", nameof(EducationEntity), id.ToString(), true, $"{{\"institution\":\"{edu.Institution}\"}}");
        return StatusCode(204);
    }
    #endregion

    #region Skill Groups & Skills CMS
    [HttpGet("skill-groups")]
    public async Task<IActionResult> GetSkillGroups()
    {
        var groups = await _db.SkillGroups.Include(x => x.Skills).AsNoTracking().ToListAsync();
        return OkResponse(groups);
    }

    [HttpGet("skill-groups/{id:guid}")]
    public async Task<IActionResult> GetSkillGroupById(Guid id)
    {
        var group = await _db.SkillGroups.Include(x => x.Skills).AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (group == null) return FailResponse("SKILL_GROUP_NOT_FOUND", $"SkillGroup with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(group);
    }

    [HttpPost("skill-groups")]
    public async Task<IActionResult> CreateSkillGroup([FromBody] AdminSkillGroupRequest request)
    {
        var group = new SkillGroupEntity
        {
            Category = request.Category,
            LabelEn = request.LabelEn,
            LabelAr = request.LabelAr,
            DescriptionEn = request.DescriptionEn,
            DescriptionAr = request.DescriptionAr,
            PublicVisible = request.PublicVisible
        };

        _db.SkillGroups.Add(group);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CREATE_SKILL_GROUP", nameof(SkillGroupEntity), group.Id.ToString(), true, $"{{\"label\":\"{group.LabelEn}\"}}");
        return StatusCode(201, ApiResponse<SkillGroupEntity>.Ok(group));
    }

    [HttpPut("skill-groups/{id:guid}")]
    public async Task<IActionResult> UpdateSkillGroup(Guid id, [FromBody] AdminSkillGroupRequest request)
    {
        var group = await _db.SkillGroups.FirstOrDefaultAsync(x => x.Id == id);
        if (group == null) return FailResponse("SKILL_GROUP_NOT_FOUND", $"SkillGroup with ID '{id}' was not found.", statusCode: 404);

        group.Category = request.Category;
        group.LabelEn = request.LabelEn;
        group.LabelAr = request.LabelAr;
        group.DescriptionEn = request.DescriptionEn;
        group.DescriptionAr = request.DescriptionAr;
        group.PublicVisible = request.PublicVisible;
        group.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UPDATE_SKILL_GROUP", nameof(SkillGroupEntity), group.Id.ToString(), true, $"{{\"label\":\"{group.LabelEn}\"}}");
        return OkResponse(group);
    }

    [HttpDelete("skill-groups/{id:guid}")]
    public async Task<IActionResult> DeleteSkillGroup(Guid id)
    {
        var group = await _db.SkillGroups.FirstOrDefaultAsync(x => x.Id == id);
        if (group == null) return FailResponse("SKILL_GROUP_NOT_FOUND", $"SkillGroup with ID '{id}' was not found.", statusCode: 404);

        _db.SkillGroups.Remove(group);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DELETE_SKILL_GROUP", nameof(SkillGroupEntity), id.ToString(), true, $"{{\"label\":\"{group.LabelEn}\"}}");
        return StatusCode(204);
    }

    [HttpGet("skills")]
    public async Task<IActionResult> GetSkills()
    {
        var skills = await _db.Skills.AsNoTracking().ToListAsync();
        return OkResponse(skills);
    }

    [HttpGet("skills/{id:guid}")]
    public async Task<IActionResult> GetSkillById(Guid id)
    {
        var skill = await _db.Skills.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (skill == null) return FailResponse("SKILL_NOT_FOUND", $"Skill with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(skill);
    }

    [HttpPost("skills")]
    public async Task<IActionResult> CreateSkill([FromBody] AdminSkillRequest request)
    {
        var groupExists = await _db.SkillGroups.AnyAsync(x => x.Id == request.SkillGroupId);
        if (!groupExists) return FailResponse("INVALID_SKILL_GROUP", $"SkillGroup with ID '{request.SkillGroupId}' does not exist.", statusCode: 400);

        var skill = new SkillEntity
        {
            SkillGroupId = request.SkillGroupId,
            Name = request.Name,
            Category = request.Category,
            ContextEn = request.ContextEn,
            ContextAr = request.ContextAr,
            ProficiencyLabel = request.ProficiencyLabel,
            Emphasis = request.Emphasis,
            Featured = request.Featured,
            PublicVisible = request.PublicVisible
        };

        _db.Skills.Add(skill);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CREATE_SKILL", nameof(SkillEntity), skill.Id.ToString(), true, $"{{\"name\":\"{skill.Name}\"}}");
        return StatusCode(201, ApiResponse<SkillEntity>.Ok(skill));
    }

    [HttpPut("skills/{id:guid}")]
    public async Task<IActionResult> UpdateSkill(Guid id, [FromBody] AdminSkillRequest request)
    {
        var skill = await _db.Skills.FirstOrDefaultAsync(x => x.Id == id);
        if (skill == null) return FailResponse("SKILL_NOT_FOUND", $"Skill with ID '{id}' was not found.", statusCode: 404);

        var groupExists = await _db.SkillGroups.AnyAsync(x => x.Id == request.SkillGroupId);
        if (!groupExists) return FailResponse("INVALID_SKILL_GROUP", $"SkillGroup with ID '{request.SkillGroupId}' does not exist.", statusCode: 400);

        skill.SkillGroupId = request.SkillGroupId;
        skill.Name = request.Name;
        skill.Category = request.Category;
        skill.ContextEn = request.ContextEn;
        skill.ContextAr = request.ContextAr;
        skill.ProficiencyLabel = request.ProficiencyLabel;
        skill.Emphasis = request.Emphasis;
        skill.Featured = request.Featured;
        skill.PublicVisible = request.PublicVisible;
        skill.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UPDATE_SKILL", nameof(SkillEntity), skill.Id.ToString(), true, $"{{\"name\":\"{skill.Name}\"}}");
        return OkResponse(skill);
    }

    [HttpDelete("skills/{id:guid}")]
    public async Task<IActionResult> DeleteSkill(Guid id)
    {
        var skill = await _db.Skills.FirstOrDefaultAsync(x => x.Id == id);
        if (skill == null) return FailResponse("SKILL_NOT_FOUND", $"Skill with ID '{id}' was not found.", statusCode: 404);

        _db.Skills.Remove(skill);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DELETE_SKILL", nameof(SkillEntity), id.ToString(), true, $"{{\"name\":\"{skill.Name}\"}}");
        return StatusCode(204);
    }
    #endregion

    #region Services CMS
    [HttpGet("services")]
    public async Task<IActionResult> GetServices()
    {
        var services = await _db.Services.AsNoTracking().ToListAsync();
        return OkResponse(services);
    }

    [HttpGet("services/{id:guid}")]
    public async Task<IActionResult> GetServiceById(Guid id)
    {
        var service = await _db.Services.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (service == null) return FailResponse("SERVICE_NOT_FOUND", $"Service with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(service);
    }

    [HttpPost("services")]
    public async Task<IActionResult> CreateService([FromBody] AdminServiceRequest request)
    {
        var service = new ServiceEntity
        {
            TitleEn = request.TitleEn,
            TitleAr = request.TitleAr,
            SummaryEn = request.SummaryEn,
            SummaryAr = request.SummaryAr,
            DescriptionEn = request.DescriptionEn,
            DescriptionAr = request.DescriptionAr,
            CapabilitiesEn = request.CapabilitiesEn,
            CapabilitiesAr = request.CapabilitiesAr,
            DeliverablesEn = request.DeliverablesEn,
            DeliverablesAr = request.DeliverablesAr,
            IdealForEn = request.IdealForEn,
            IdealForAr = request.IdealForAr,
            RelatedProjects = request.RelatedProjects,
            PublicVisible = request.PublicVisible
        };

        _db.Services.Add(service);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CREATE_SERVICE", nameof(ServiceEntity), service.Id.ToString(), true, $"{{\"title\":\"{service.TitleEn}\"}}");
        return StatusCode(201, ApiResponse<ServiceEntity>.Ok(service));
    }

    [HttpPut("services/{id:guid}")]
    public async Task<IActionResult> UpdateService(Guid id, [FromBody] AdminServiceRequest request)
    {
        var service = await _db.Services.FirstOrDefaultAsync(x => x.Id == id);
        if (service == null) return FailResponse("SERVICE_NOT_FOUND", $"Service with ID '{id}' was not found.", statusCode: 404);

        service.TitleEn = request.TitleEn;
        service.TitleAr = request.TitleAr;
        service.SummaryEn = request.SummaryEn;
        service.SummaryAr = request.SummaryAr;
        service.DescriptionEn = request.DescriptionEn;
        service.DescriptionAr = request.DescriptionAr;
        service.CapabilitiesEn = request.CapabilitiesEn;
        service.CapabilitiesAr = request.CapabilitiesAr;
        service.DeliverablesEn = request.DeliverablesEn;
        service.DeliverablesAr = request.DeliverablesAr;
        service.IdealForEn = request.IdealForEn;
        service.IdealForAr = request.IdealForAr;
        service.RelatedProjects = request.RelatedProjects;
        service.PublicVisible = request.PublicVisible;
        service.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UPDATE_SERVICE", nameof(ServiceEntity), service.Id.ToString(), true, $"{{\"title\":\"{service.TitleEn}\"}}");
        return OkResponse(service);
    }

    [HttpDelete("services/{id:guid}")]
    public async Task<IActionResult> DeleteService(Guid id)
    {
        var service = await _db.Services.FirstOrDefaultAsync(x => x.Id == id);
        if (service == null) return FailResponse("SERVICE_NOT_FOUND", $"Service with ID '{id}' was not found.", statusCode: 404);

        _db.Services.Remove(service);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DELETE_SERVICE", nameof(ServiceEntity), id.ToString(), true, $"{{\"title\":\"{service.TitleEn}\"}}");
        return StatusCode(204);
    }
    #endregion

    #region Products CMS
    [HttpGet("products")]
    public async Task<IActionResult> GetProducts()
    {
        var products = await _db.Products.AsNoTracking().ToListAsync();
        return OkResponse(products);
    }

    [HttpGet("products/{id:guid}")]
    public async Task<IActionResult> GetProductById(Guid id)
    {
        var product = await _db.Products.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (product == null) return FailResponse("PRODUCT_NOT_FOUND", $"Product with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(product);
    }

    [HttpPost("products")]
    public async Task<IActionResult> CreateProduct([FromBody] AdminProductRequest request)
    {
        var exists = await _db.Products.AnyAsync(x => x.Slug.ToLower() == request.Slug.ToLower());
        if (exists)
        {
            await LogAuditAsync("CREATE_PRODUCT_FAILED", nameof(ProductEntity), null, false, $"{{\"slug\":\"{request.Slug}\",\"reason\":\"duplicate_slug\"}}");
            return FailResponse("DUPLICATE_SLUG", $"A product with slug '{request.Slug}' already exists.", statusCode: 409);
        }

        var product = new ProductEntity
        {
            Slug = request.Slug,
            NameEn = request.NameEn,
            NameAr = request.NameAr,
            Category = request.Category,
            Lifecycle = request.Lifecycle,
            TaglineEn = request.TaglineEn,
            TaglineAr = request.TaglineAr,
            SummaryEn = request.SummaryEn,
            SummaryAr = request.SummaryAr,
            DescriptionEn = request.DescriptionEn,
            DescriptionAr = request.DescriptionAr,
            FeaturesEn = request.FeaturesEn,
            FeaturesAr = request.FeaturesAr,
            Technologies = request.Technologies,
            ExternalUrl = request.ExternalUrl,
            DemoUrl = request.DemoUrl,
            DocsUrl = request.DocsUrl,
            PublicVisible = request.PublicVisible
        };

        _db.Products.Add(product);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CREATE_PRODUCT", nameof(ProductEntity), product.Id.ToString(), true, $"{{\"slug\":\"{product.Slug}\"}}");
        return StatusCode(201, ApiResponse<ProductEntity>.Ok(product));
    }

    [HttpPut("products/{id:guid}")]
    public async Task<IActionResult> UpdateProduct(Guid id, [FromBody] AdminProductRequest request)
    {
        var product = await _db.Products.FirstOrDefaultAsync(x => x.Id == id);
        if (product == null) return FailResponse("PRODUCT_NOT_FOUND", $"Product with ID '{id}' was not found.", statusCode: 404);

        var slugConflict = await _db.Products.AnyAsync(x => x.Id != id && x.Slug.ToLower() == request.Slug.ToLower());
        if (slugConflict)
        {
            await LogAuditAsync("UPDATE_PRODUCT_FAILED", nameof(ProductEntity), id.ToString(), false, $"{{\"slug\":\"{request.Slug}\",\"reason\":\"duplicate_slug\"}}");
            return FailResponse("DUPLICATE_SLUG", $"A product with slug '{request.Slug}' already exists.", statusCode: 409);
        }

        product.Slug = request.Slug;
        product.NameEn = request.NameEn;
        product.NameAr = request.NameAr;
        product.Category = request.Category;
        product.Lifecycle = request.Lifecycle;
        product.TaglineEn = request.TaglineEn;
        product.TaglineAr = request.TaglineAr;
        product.SummaryEn = request.SummaryEn;
        product.SummaryAr = request.SummaryAr;
        product.DescriptionEn = request.DescriptionEn;
        product.DescriptionAr = request.DescriptionAr;
        product.FeaturesEn = request.FeaturesEn;
        product.FeaturesAr = request.FeaturesAr;
        product.Technologies = request.Technologies;
        product.ExternalUrl = request.ExternalUrl;
        product.DemoUrl = request.DemoUrl;
        product.DocsUrl = request.DocsUrl;
        product.PublicVisible = request.PublicVisible;
        product.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UPDATE_PRODUCT", nameof(ProductEntity), product.Id.ToString(), true, $"{{\"slug\":\"{product.Slug}\"}}");
        return OkResponse(product);
    }

    [HttpDelete("products/{id:guid}")]
    public async Task<IActionResult> DeleteProduct(Guid id)
    {
        var product = await _db.Products.FirstOrDefaultAsync(x => x.Id == id);
        if (product == null) return FailResponse("PRODUCT_NOT_FOUND", $"Product with ID '{id}' was not found.", statusCode: 404);

        _db.Products.Remove(product);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DELETE_PRODUCT", nameof(ProductEntity), id.ToString(), true, $"{{\"slug\":\"{product.Slug}\"}}");
        return StatusCode(204);
    }
    #endregion

    #region Courses CMS
    [HttpGet("courses")]
    public async Task<IActionResult> GetCourses()
    {
        var courses = await _db.Courses.AsNoTracking().OrderBy(x => x.Order).ToListAsync();
        return OkResponse(courses);
    }

    [HttpGet("courses/{id:guid}")]
    public async Task<IActionResult> GetCourseById(Guid id)
    {
        var course = await _db.Courses.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (course == null) return FailResponse("COURSE_NOT_FOUND", $"Course with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(course);
    }

    [HttpPost("courses")]
    public async Task<IActionResult> CreateCourse([FromBody] AdminCourseRequest request)
    {
        var exists = await _db.Courses.AnyAsync(x => x.Slug.ToLower() == request.Slug.ToLower());
        if (exists)
        {
            await LogAuditAsync("CREATE_COURSE_FAILED", nameof(CourseEntity), null, false, $"{{\"slug\":\"{request.Slug}\",\"reason\":\"duplicate_slug\"}}");
            return FailResponse("DUPLICATE_SLUG", $"A course with slug '{request.Slug}' already exists.", statusCode: 409);
        }

        var course = new CourseEntity
        {
            Slug = request.Slug,
            TitleEn = request.TitleEn,
            TitleAr = request.TitleAr,
            Order = request.Order,
            Url = request.Url,
            PublicVisible = request.PublicVisible
        };

        _db.Courses.Add(course);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CREATE_COURSE", nameof(CourseEntity), course.Id.ToString(), true, $"{{\"slug\":\"{course.Slug}\"}}");
        return StatusCode(201, ApiResponse<CourseEntity>.Ok(course));
    }

    [HttpPut("courses/{id:guid}")]
    public async Task<IActionResult> UpdateCourse(Guid id, [FromBody] AdminCourseRequest request)
    {
        var course = await _db.Courses.FirstOrDefaultAsync(x => x.Id == id);
        if (course == null) return FailResponse("COURSE_NOT_FOUND", $"Course with ID '{id}' was not found.", statusCode: 404);

        var slugConflict = await _db.Courses.AnyAsync(x => x.Id != id && x.Slug.ToLower() == request.Slug.ToLower());
        if (slugConflict)
        {
            await LogAuditAsync("UPDATE_COURSE_FAILED", nameof(CourseEntity), id.ToString(), false, $"{{\"slug\":\"{request.Slug}\",\"reason\":\"duplicate_slug\"}}");
            return FailResponse("DUPLICATE_SLUG", $"A course with slug '{request.Slug}' already exists.", statusCode: 409);
        }

        course.Slug = request.Slug;
        course.TitleEn = request.TitleEn;
        course.TitleAr = request.TitleAr;
        course.Order = request.Order;
        course.Url = request.Url;
        course.PublicVisible = request.PublicVisible;
        course.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UPDATE_COURSE", nameof(CourseEntity), course.Id.ToString(), true, $"{{\"slug\":\"{course.Slug}\"}}");
        return OkResponse(course);
    }

    [HttpDelete("courses/{id:guid}")]
    public async Task<IActionResult> DeleteCourse(Guid id)
    {
        var course = await _db.Courses.FirstOrDefaultAsync(x => x.Id == id);
        if (course == null) return FailResponse("COURSE_NOT_FOUND", $"Course with ID '{id}' was not found.", statusCode: 404);

        _db.Courses.Remove(course);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DELETE_COURSE", nameof(CourseEntity), id.ToString(), true, $"{{\"slug\":\"{course.Slug}\"}}");
        return StatusCode(204);
    }
    #endregion

    #region Client Requests CRM
    [HttpGet("requests")]
    public async Task<IActionResult> GetRequests([FromQuery] string? status, [FromQuery] string? search)
    {
        var query = _db.ContactMessages.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(status) && status.ToLower() != "all")
        {
            var targetStatus = status.ToLower();
            query = query.Where(r => r.StatusState.ToLower() == targetStatus);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.ToLower();
            query = query.Where(r => r.Name.ToLower().Contains(term) ||
                                     r.Email.ToLower().Contains(term) ||
                                     r.Subject.ToLower().Contains(term) ||
                                     r.Message.ToLower().Contains(term));
        }

        var items = await query.OrderByDescending(r => r.CreatedAt).ToListAsync();

        var dtos = items.Select(MapContactMessageDto).ToList();
        return OkResponse(dtos);
    }

    [HttpGet("requests/{id:guid}")]
    public async Task<IActionResult> GetRequestById(Guid id)
    {
        var item = await _db.ContactMessages.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (item == null) return FailResponse("REQUEST_NOT_FOUND", $"Contact request with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(MapContactMessageDto(item));
    }

    [HttpPatch("requests/{id:guid}/status")]
    public async Task<IActionResult> UpdateRequestStatus(Guid id, [FromBody] UpdateContactRequestStatusRequest request)
    {
        var item = await _db.ContactMessages.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("UpdateContactRequestStatus", nameof(ContactMessageEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("REQUEST_NOT_FOUND", $"Contact request with ID '{id}' was not found.", statusCode: 404);
        }

        var validator = new Portfolio.Application.Validators.UpdateContactRequestStatusValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("UpdateContactRequestStatus", nameof(ContactMessageEntity), id.ToString(), false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid status update payload.", errors, statusCode: 400);
        }

        var oldStatus = item.StatusState;
        item.StatusState = request.StatusState.ToLowerInvariant();
        item.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UpdateContactRequestStatus", "ContactMessage", item.Id.ToString(), true, $"{{\"oldStatus\":\"{oldStatus}\",\"newStatus\":\"{item.StatusState}\"}}");

        return OkResponse(MapContactMessageDto(item));
    }

    [HttpPost("requests/{id:guid}/notes")]
    public async Task<IActionResult> UpdateRequestNote(Guid id, [FromBody] UpdateContactRequestNoteRequest request)
    {
        var item = await _db.ContactMessages.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("UpdateContactRequestNote", nameof(ContactMessageEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("REQUEST_NOT_FOUND", $"Contact request with ID '{id}' was not found.", statusCode: 404);
        }

        var validator = new Portfolio.Application.Validators.UpdateContactRequestNoteValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("UpdateContactRequestNote", nameof(ContactMessageEntity), id.ToString(), false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid note payload.", errors, statusCode: 400);
        }

        item.AdminNote = request.AdminNote;
        item.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UpdateContactRequestNote", "ContactMessage", item.Id.ToString(), true, $"{{\"noteLength\":{request.AdminNote?.Length ?? 0}}}");

        return OkResponse(MapContactMessageDto(item));
    }

    [HttpDelete("requests/{id:guid}")]
    public async Task<IActionResult> DeleteRequest(Guid id)
    {
        var item = await _db.ContactMessages.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("DeleteContactRequest", nameof(ContactMessageEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("REQUEST_NOT_FOUND", $"Contact request with ID '{id}' was not found.", statusCode: 404);
        }

        _db.ContactMessages.Remove(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DeleteContactRequest", "ContactMessage", id.ToString(), true, null);
        return StatusCode(204);
    }

    private static AdminContactMessageDto MapContactMessageDto(ContactMessageEntity item) => new()
    {
        Id = item.Id,
        Name = item.Name,
        Email = item.Email,
        Subject = item.Subject,
        Message = item.Message,
        IpAddress = item.IpAddress,
        StatusState = item.StatusState,
        AdminNote = item.AdminNote,
        CreatedAt = item.CreatedAt,
        UpdatedAt = item.UpdatedAt
    };
    #endregion

    #region Payment Submissions Admin
    [HttpGet("payments")]
    public async Task<IActionResult> GetPaymentSubmissions()
    {
        var items = await _db.PaymentSubmissions.AsNoTracking().OrderByDescending(x => x.CreatedAt).ToListAsync();
        var dtos = items.Select(MapPaymentSubmissionDto).ToList();
        return OkResponse(dtos);
    }

    [HttpGet("payments/{id:guid}")]
    public async Task<IActionResult> GetPaymentSubmissionById(Guid id)
    {
        var item = await _db.PaymentSubmissions.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (item == null) return FailResponse("PAYMENT_NOT_FOUND", $"Payment submission with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(MapPaymentSubmissionDto(item));
    }

    [HttpPatch("payments/{id:guid}/status")]
    public async Task<IActionResult> UpdatePaymentSubmissionStatus(Guid id, [FromBody] UpdatePaymentSubmissionStatusRequest request)
    {
        var validator = new Portfolio.Application.Validators.UpdatePaymentSubmissionStatusValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("UpdatePaymentSubmissionStatus", nameof(PaymentSubmissionEntity), id.ToString(), false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid status payload.", errors, statusCode: 400);
        }

        var item = await _db.PaymentSubmissions.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("UpdatePaymentSubmissionStatus", nameof(PaymentSubmissionEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("PAYMENT_NOT_FOUND", $"Payment submission with ID '{id}' was not found.", statusCode: 404);
        }

        var oldStatus = item.StatusState;
        item.StatusState = request.StatusState;
        item.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UpdatePaymentSubmissionStatus", nameof(PaymentSubmissionEntity), item.Id.ToString(), true, $"{{\"oldStatus\":\"{oldStatus}\",\"newStatus\":\"{item.StatusState}\"}}");

        return OkResponse(MapPaymentSubmissionDto(item));
    }

    [HttpPost("payments/{id:guid}/notes")]
    public async Task<IActionResult> UpdatePaymentSubmissionNote(Guid id, [FromBody] UpdatePaymentSubmissionNoteRequest request)
    {
        var item = await _db.PaymentSubmissions.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("UpdatePaymentSubmissionNote", nameof(PaymentSubmissionEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("PAYMENT_NOT_FOUND", $"Payment submission with ID '{id}' was not found.", statusCode: 404);
        }

        var validator = new Portfolio.Application.Validators.UpdatePaymentSubmissionNoteValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("UpdatePaymentSubmissionNote", nameof(PaymentSubmissionEntity), id.ToString(), false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid note payload.", errors, statusCode: 400);
        }

        item.AdminNote = request.AdminNote;
        item.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UpdatePaymentSubmissionNote", nameof(PaymentSubmissionEntity), item.Id.ToString(), true, $"{{\"noteLength\":{request.AdminNote?.Length ?? 0}}}");

        return OkResponse(MapPaymentSubmissionDto(item));
    }

    [HttpDelete("payments/{id:guid}")]
    public async Task<IActionResult> DeletePaymentSubmission(Guid id)
    {
        var item = await _db.PaymentSubmissions.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("DeletePaymentSubmission", nameof(PaymentSubmissionEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("PAYMENT_NOT_FOUND", $"Payment submission with ID '{id}' was not found.", statusCode: 404);
        }

        _db.PaymentSubmissions.Remove(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DeletePaymentSubmission", nameof(PaymentSubmissionEntity), id.ToString(), true, $"{{\"proofPath\":\"{item.ProofPath}\"}}");
        return StatusCode(204);
    }

    private static AdminPaymentSubmissionDto MapPaymentSubmissionDto(PaymentSubmissionEntity item) => new()
    {
        Id = item.Id,
        ClientName = item.ClientName,
        Email = item.Email,
        Whatsapp = item.Whatsapp,
        ServiceId = item.ServiceId,
        ServiceTitle = item.ServiceTitle,
        ProjectName = item.ProjectName,
        Amount = item.Amount,
        Currency = item.Currency,
        MethodId = item.MethodId,
        ProofPath = item.ProofPath,
        ProofFilename = item.ProofFilename,
        ProofType = item.ProofType,
        ProofSizeBytes = item.ProofSizeBytes,
        StatusState = item.StatusState,
        AdminNote = item.AdminNote,
        CreatedAt = item.CreatedAt,
        UpdatedAt = item.UpdatedAt
    };
    #endregion

    #region Media Assets Admin
    [HttpGet("media")]
    public async Task<IActionResult> GetMediaAssets([FromQuery] string? search)
    {
        var query = _db.MediaAssets.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim().ToLower();
            query = query.Where(m => m.Filename.ToLower().Contains(term) ||
                                     (m.AltEn != null && m.AltEn.ToLower().Contains(term)) ||
                                     (m.AltAr != null && m.AltAr.ToLower().Contains(term)));
        }

        var items = await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
        var dtos = items.Select(MapMediaAssetDto).ToList();
        return OkResponse(dtos);
    }

    [HttpGet("media/{id:guid}")]
    public async Task<IActionResult> GetMediaAssetById(Guid id)
    {
        var item = await _db.MediaAssets.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (item == null) return FailResponse("MEDIA_NOT_FOUND", $"Media asset with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(MapMediaAssetDto(item));
    }

    [HttpPost("media")]
    public async Task<IActionResult> RegisterMediaAsset([FromBody] RegisterMediaAssetRequest request)
    {
        var validator = new Portfolio.Application.Validators.RegisterMediaAssetValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("RegisterMediaAsset", nameof(MediaAssetEntity), null, false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid media payload.", errors, statusCode: 400);
        }

        var publicUrl = !string.IsNullOrWhiteSpace(request.PublicUrl)
            ? request.PublicUrl.Trim()
            : $"/api/public/media/{request.StoragePath.Trim()}";

        var item = new MediaAssetEntity
        {
            Filename = request.Filename.Trim(),
            StoragePath = request.StoragePath.Trim(),
            PublicUrl = publicUrl,
            MimeType = request.MimeType?.Trim(),
            SizeBytes = request.SizeBytes,
            AltEn = request.AltEn?.Trim(),
            AltAr = request.AltAr?.Trim(),
            CaptionEn = request.CaptionEn?.Trim(),
            CaptionAr = request.CaptionAr?.Trim(),
            CreatedBy = GetActorId()
        };

        _db.MediaAssets.Add(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("RegisterMediaAsset", nameof(MediaAssetEntity), item.Id.ToString(), true, $"{{\"filename\":\"{item.Filename}\",\"storagePath\":\"{item.StoragePath}\"}}");
        return StatusCode(201, ApiResponse<AdminMediaAssetDto>.Ok(MapMediaAssetDto(item)));
    }

    [HttpPost("media/upload")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UploadMediaAsset([FromForm] UploadMediaAssetRequest request)
    {
        if (request.File == null || request.File.Length == 0)
        {
            await LogAuditAsync("UploadMediaAsset", nameof(MediaAssetEntity), null, false, "{\"reason\":\"empty_file\"}");
            return FailResponse("INVALID_FILE", "A non-empty file must be provided.", statusCode: 400);
        }

        var storageDir = System.IO.Path.Combine(System.IO.Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        if (!System.IO.Directory.Exists(storageDir))
        {
            System.IO.Directory.CreateDirectory(storageDir);
        }

        var uniqueFileName = $"{Guid.NewGuid():N}_{System.IO.Path.GetFileName(request.File.FileName)}";
        var filePath = System.IO.Path.Combine(storageDir, uniqueFileName);

        using (var stream = new System.IO.FileStream(filePath, System.IO.FileMode.Create))
        {
            await request.File.CopyToAsync(stream);
        }

        var publicUrl = $"/api/v1/media/file/{uniqueFileName}";

        var item = new MediaAssetEntity
        {
            Filename = request.File.FileName,
            StoragePath = uniqueFileName,
            PublicUrl = publicUrl,
            MimeType = request.File.ContentType ?? "application/octet-stream",
            SizeBytes = request.File.Length,
            AltEn = request.AltEn?.Trim(),
            AltAr = request.AltAr?.Trim(),
            CaptionEn = request.CaptionEn?.Trim(),
            CaptionAr = request.CaptionAr?.Trim(),
            CreatedBy = GetActorId()
        };

        _db.MediaAssets.Add(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("UploadMediaAsset", nameof(MediaAssetEntity), item.Id.ToString(), true, $"{{\"filename\":\"{item.Filename}\",\"storagePath\":\"{item.StoragePath}\"}}");
        return StatusCode(201, ApiResponse<AdminMediaAssetDto>.Ok(MapMediaAssetDto(item)));
    }


    [HttpPut("media/{id:guid}")]
    public async Task<IActionResult> UpdateMediaAsset(Guid id, [FromBody] UpdateMediaAssetRequest request)
    {
        var item = await _db.MediaAssets.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("UpdateMediaAsset", nameof(MediaAssetEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("MEDIA_NOT_FOUND", $"Media asset with ID '{id}' was not found.", statusCode: 404);
        }

        var validator = new Portfolio.Application.Validators.UpdateMediaAssetValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("UpdateMediaAsset", nameof(MediaAssetEntity), id.ToString(), false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid media update payload.", errors, statusCode: 400);
        }

        item.AltEn = request.AltEn?.Trim();
        item.AltAr = request.AltAr?.Trim();
        item.CaptionEn = request.CaptionEn?.Trim();
        item.CaptionAr = request.CaptionAr?.Trim();
        item.Archived = request.Archived;
        item.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UpdateMediaAsset", nameof(MediaAssetEntity), item.Id.ToString(), true, $"{{\"filename\":\"{item.Filename}\"}}");

        return OkResponse(MapMediaAssetDto(item));
    }

    [HttpDelete("media/{id:guid}")]
    public async Task<IActionResult> DeleteMediaAsset(Guid id)
    {
        var item = await _db.MediaAssets.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("DeleteMediaAsset", nameof(MediaAssetEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("MEDIA_NOT_FOUND", $"Media asset with ID '{id}' was not found.", statusCode: 404);
        }

        _db.MediaAssets.Remove(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DeleteMediaAsset", nameof(MediaAssetEntity), id.ToString(), true, $"{{\"storagePath\":\"{item.StoragePath}\"}}");
        return StatusCode(204);
    }

    private static AdminMediaAssetDto MapMediaAssetDto(MediaAssetEntity item) => new()
    {
        Id = item.Id,
        Filename = item.Filename,
        StoragePath = item.StoragePath,
        PublicUrl = item.PublicUrl,
        MimeType = item.MimeType,
        SizeBytes = item.SizeBytes,
        AltEn = item.AltEn,
        AltAr = item.AltAr,
        CaptionEn = item.CaptionEn,
        CaptionAr = item.CaptionAr,
        Archived = item.Archived,
        CreatedAt = item.CreatedAt,
        UpdatedAt = item.UpdatedAt
    };
    #endregion

    #region Clients Admin
    [HttpGet("clients")]
    public async Task<IActionResult> GetClients()
    {
        var items = await _db.Clients.AsNoTracking().OrderByDescending(x => x.CreatedAt).ToListAsync();
        var dtos = items.Select(MapClientDto).ToList();
        return OkResponse(dtos);
    }

    [HttpGet("clients/{id:guid}")]
    public async Task<IActionResult> GetClientById(Guid id)
    {
        var item = await _db.Clients.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (item == null) return FailResponse("CLIENT_NOT_FOUND", $"Client with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(MapClientDto(item));
    }

    [HttpPost("clients")]
    public async Task<IActionResult> CreateClient([FromBody] CreateClientRequest request)
    {
        var validator = new Portfolio.Application.Validators.CreateClientValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("CreateClient", nameof(ClientProfileEntity), null, false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid client payload.", errors, statusCode: 400);
        }

        var item = new ClientProfileEntity
        {
            Name = request.Name.Trim(),
            Email = request.Email?.Trim(),
            Whatsapp = request.Whatsapp?.Trim(),
            Country = request.Country?.Trim(),
            Service = request.Service?.Trim(),
            Projects = request.Projects?.Trim(),
            PaymentStatus = request.PaymentStatus?.Trim(),
            Status = string.IsNullOrWhiteSpace(request.Status) ? "client" : request.Status.Trim(),
            Plan = request.Plan?.Trim(),
            SubscriptionState = request.SubscriptionState?.Trim(),
            PaymentState = request.PaymentState?.Trim(),
            PaymentMethod = request.PaymentMethod?.Trim(),
            Amount = request.Amount?.Trim(),
            Currency = request.Currency?.Trim(),
            PaidAmount = request.PaidAmount?.Trim(),
            LastPaymentAt = request.LastPaymentAt?.Trim(),
            NextRenewalAt = request.NextRenewalAt?.Trim(),
            InvoiceRef = request.InvoiceRef?.Trim()
        };

        _db.Clients.Add(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CreateClient", nameof(ClientProfileEntity), item.Id.ToString(), true, $"{{\"name\":\"{item.Name}\"}}");
        return StatusCode(201, ApiResponse<AdminClientDto>.Ok(MapClientDto(item)));
    }

    [HttpPut("clients/{id:guid}")]
    public async Task<IActionResult> UpdateClient(Guid id, [FromBody] UpdateClientRequest request)
    {
        var item = await _db.Clients.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("UpdateClient", nameof(ClientProfileEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("CLIENT_NOT_FOUND", $"Client with ID '{id}' was not found.", statusCode: 404);
        }

        var validator = new Portfolio.Application.Validators.UpdateClientValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("UpdateClient", nameof(ClientProfileEntity), id.ToString(), false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid client update payload.", errors, statusCode: 400);
        }

        if (!string.IsNullOrWhiteSpace(request.Name)) item.Name = request.Name.Trim();
        if (request.Email != null) item.Email = request.Email.Trim();
        if (request.Whatsapp != null) item.Whatsapp = request.Whatsapp.Trim();
        if (request.Country != null) item.Country = request.Country.Trim();
        if (request.Service != null) item.Service = request.Service.Trim();
        if (request.Projects != null) item.Projects = request.Projects.Trim();
        if (request.PaymentStatus != null) item.PaymentStatus = request.PaymentStatus.Trim();
        if (!string.IsNullOrWhiteSpace(request.Status)) item.Status = request.Status.Trim();
        if (request.Plan != null) item.Plan = request.Plan.Trim();
        if (request.SubscriptionState != null) item.SubscriptionState = request.SubscriptionState.Trim();
        if (request.PaymentState != null) item.PaymentState = request.PaymentState.Trim();
        if (request.PaymentMethod != null) item.PaymentMethod = request.PaymentMethod.Trim();
        if (request.Amount != null) item.Amount = request.Amount.Trim();
        if (request.Currency != null) item.Currency = request.Currency.Trim();
        if (request.PaidAmount != null) item.PaidAmount = request.PaidAmount.Trim();
        if (request.LastPaymentAt != null) item.LastPaymentAt = request.LastPaymentAt.Trim();
        if (request.NextRenewalAt != null) item.NextRenewalAt = request.NextRenewalAt.Trim();
        if (request.InvoiceRef != null) item.InvoiceRef = request.InvoiceRef.Trim();
        item.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UpdateClient", nameof(ClientProfileEntity), item.Id.ToString(), true, $"{{\"name\":\"{item.Name}\"}}");

        return OkResponse(MapClientDto(item));
    }

    [HttpDelete("clients/{id:guid}")]
    public async Task<IActionResult> DeleteClient(Guid id)
    {
        var item = await _db.Clients.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("DeleteClient", nameof(ClientProfileEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("CLIENT_NOT_FOUND", $"Client with ID '{id}' was not found.", statusCode: 404);
        }

        _db.Clients.Remove(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DeleteClient", nameof(ClientProfileEntity), id.ToString(), true, null);
        return StatusCode(204);
    }

    private static AdminClientDto MapClientDto(ClientProfileEntity item) => new()
    {
        Id = item.Id,
        Name = item.Name,
        Email = item.Email,
        Whatsapp = item.Whatsapp,
        Country = item.Country,
        Service = item.Service,
        Projects = item.Projects,
        PaymentStatus = item.PaymentStatus,
        Status = item.Status,
        Plan = item.Plan,
        SubscriptionState = item.SubscriptionState,
        PaymentState = item.PaymentState,
        PaymentMethod = item.PaymentMethod,
        Amount = item.Amount,
        Currency = item.Currency,
        PaidAmount = item.PaidAmount,
        LastPaymentAt = item.LastPaymentAt,
        NextRenewalAt = item.NextRenewalAt,
        InvoiceRef = item.InvoiceRef,
        CreatedAt = item.CreatedAt,
        UpdatedAt = item.UpdatedAt
    };
    #endregion

    #region Invoices Admin
    [HttpGet("invoices")]
    public async Task<IActionResult> GetInvoices()
    {
        var items = await _db.Invoices.AsNoTracking().OrderByDescending(x => x.PaidAt).ThenByDescending(x => x.CreatedAt).ToListAsync();
        var dtos = items.Select(MapInvoiceDto).ToList();
        return OkResponse(dtos);
    }

    [HttpGet("invoices/{id:guid}")]
    public async Task<IActionResult> GetInvoiceById(Guid id)
    {
        var item = await _db.Invoices.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (item == null) return FailResponse("INVOICE_NOT_FOUND", $"Invoice with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(MapInvoiceDto(item));
    }

    [HttpPost("invoices")]
    public async Task<IActionResult> CreateInvoice([FromBody] CreateInvoiceRequest request)
    {
        var validator = new Portfolio.Application.Validators.CreateInvoiceValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("CreateInvoice", nameof(InvoiceEntity), null, false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid invoice payload.", errors, statusCode: 400);
        }

        var paidAt = string.IsNullOrWhiteSpace(request.PaidAt)
            ? DateTime.UtcNow.ToString("yyyy-MM-dd")
            : request.PaidAt.Trim();

        var item = new InvoiceEntity
        {
            ClientId = request.ClientId.Trim(),
            Amount = request.Amount.Trim(),
            Currency = request.Currency.Trim(),
            Method = request.Method.Trim(),
            Status = string.IsNullOrWhiteSpace(request.Status) ? "paid" : request.Status.Trim(),
            InvoiceRef = request.InvoiceRef.Trim(),
            Note = request.Note?.Trim(),
            PaidAt = paidAt
        };

        _db.Invoices.Add(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CreateInvoice", nameof(InvoiceEntity), item.Id.ToString(), true, $"{{\"invoiceRef\":\"{item.InvoiceRef}\",\"amount\":\"{item.Amount}\"}}");
        return StatusCode(201, ApiResponse<AdminInvoiceDto>.Ok(MapInvoiceDto(item)));
    }

    [HttpPatch("invoices/{id:guid}/status")]
    public async Task<IActionResult> UpdateInvoiceStatus(Guid id, [FromBody] UpdateInvoiceStatusRequest request)
    {
        var validator = new Portfolio.Application.Validators.UpdateInvoiceStatusValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("UpdateInvoiceStatus", nameof(InvoiceEntity), id.ToString(), false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid invoice status payload.", errors, statusCode: 400);
        }

        var item = await _db.Invoices.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("UpdateInvoiceStatus", nameof(InvoiceEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("INVOICE_NOT_FOUND", $"Invoice with ID '{id}' was not found.", statusCode: 404);
        }

        item.Status = request.Status.Trim();
        item.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UpdateInvoiceStatus", nameof(InvoiceEntity), item.Id.ToString(), true, $"{{\"status\":\"{item.Status}\"}}");

        return OkResponse(MapInvoiceDto(item));
    }

    [HttpDelete("invoices/{id:guid}")]
    public async Task<IActionResult> DeleteInvoice(Guid id)
    {
        var item = await _db.Invoices.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("DeleteInvoice", nameof(InvoiceEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("INVOICE_NOT_FOUND", $"Invoice with ID '{id}' was not found.", statusCode: 404);
        }

        _db.Invoices.Remove(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DeleteInvoice", nameof(InvoiceEntity), id.ToString(), true, null);
        return StatusCode(204);
    }

    private static AdminInvoiceDto MapInvoiceDto(InvoiceEntity item) => new()
    {
        Id = item.Id,
        ClientId = item.ClientId,
        Amount = item.Amount,
        Currency = item.Currency,
        Method = item.Method,
        Status = item.Status,
        InvoiceRef = item.InvoiceRef,
        Note = item.Note,
        PaidAt = item.PaidAt,
        CreatedAt = item.CreatedAt,
        UpdatedAt = item.UpdatedAt
    };
    #endregion

    #region Distribution Config Admin
    [HttpGet("distribution")]
    public async Task<IActionResult> GetDistributionConfig()
    {
        var item = await _db.DistributionConfigs.AsNoTracking().FirstOrDefaultAsync();
        if (item == null)
        {
            item = new DistributionConfigEntity
            {
                DistributionJson = "{}",
                PixelConfigsJson = "[]",
                AdCampaignsJson = "[]"
            };
            _db.DistributionConfigs.Add(item);
            await _db.SaveChangesAsync();
        }

        return OkResponse(MapDistributionConfigDto(item));
    }

    [HttpPut("distribution")]
    public async Task<IActionResult> UpdateDistributionConfig([FromBody] UpdateDistributionConfigRequest request)
    {
        var validator = new Portfolio.Application.Validators.UpdateDistributionConfigValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("UpdateDistributionConfig", nameof(DistributionConfigEntity), null, false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid distribution payload.", errors, statusCode: 400);
        }

        var item = await _db.DistributionConfigs.FirstOrDefaultAsync();
        if (item == null)
        {
            item = new DistributionConfigEntity();
            _db.DistributionConfigs.Add(item);
        }

        if (request.DistributionJson != null) item.DistributionJson = request.DistributionJson;
        if (request.PixelConfigsJson != null) item.PixelConfigsJson = request.PixelConfigsJson;
        if (request.AdCampaignsJson != null) item.AdCampaignsJson = request.AdCampaignsJson;
        item.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UpdateDistributionConfig", nameof(DistributionConfigEntity), item.Id.ToString(), true, null);

        return OkResponse(MapDistributionConfigDto(item));
    }

    private static AdminDistributionConfigDto MapDistributionConfigDto(DistributionConfigEntity item) => new()
    {
        DistributionJson = item.DistributionJson,
        PixelConfigsJson = item.PixelConfigsJson,
        AdCampaignsJson = item.AdCampaignsJson,
        UpdatedAt = item.UpdatedAt
    };
    #endregion

    #region Articles CMS Admin
    [HttpGet("articles")]
    public async Task<IActionResult> GetAdminArticles()
    {
        var items = await _db.Articles.AsNoTracking().OrderByDescending(x => x.CreatedAt).ToListAsync();
        var dtos = items.Select(MapAdminArticleDto).ToList();
        return OkResponse(dtos);
    }

    [HttpGet("articles/{id:guid}")]
    public async Task<IActionResult> GetAdminArticleById(Guid id)
    {
        var item = await _db.Articles.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (item == null) return FailResponse("ARTICLE_NOT_FOUND", $"Article with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(MapAdminArticleDto(item));
    }

    [HttpPost("articles")]
    public async Task<IActionResult> CreateArticle([FromBody] AdminArticleRequest request)
    {
        var validator = new Portfolio.Application.Validators.AdminArticleRequestValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("CreateArticle", nameof(ArticleEntity), null, false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid article payload.", errors, statusCode: 400);
        }

        var exists = await _db.Articles.AnyAsync(x => x.Slug.ToLower() == request.Slug.Trim().ToLower());
        if (exists)
        {
            await LogAuditAsync("CreateArticle_Failed", nameof(ArticleEntity), null, false, $"{{\"slug\":\"{request.Slug}\",\"reason\":\"duplicate_slug\"}}");
            return FailResponse("DUPLICATE_SLUG", $"An article with slug '{request.Slug}' already exists.", statusCode: 409);
        }

        var item = new ArticleEntity
        {
            Slug = request.Slug.Trim(),
            TitleEn = request.TitleEn.Trim(),
            TitleAr = request.TitleAr?.Trim(),
            SummaryEn = request.SummaryEn.Trim(),
            SummaryAr = request.SummaryAr?.Trim(),
            ContentEn = request.ContentEn,
            ContentAr = request.ContentAr,
            CoverImage = request.CoverImage?.Trim(),
            Tags = request.Tags,
            Status = request.Status,
            PublicVisible = request.PublicVisible,
            PublishedAt = request.PublishedAt ?? (request.Status == ContentStatus.Verified ? DateTimeOffset.UtcNow : null)
        };

        _db.Articles.Add(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CreateArticle", nameof(ArticleEntity), item.Id.ToString(), true, $"{{\"slug\":\"{item.Slug}\"}}");
        return StatusCode(201, ApiResponse<AdminArticleDto>.Ok(MapAdminArticleDto(item)));
    }

    [HttpPut("articles/{id:guid}")]
    public async Task<IActionResult> UpdateArticle(Guid id, [FromBody] AdminArticleRequest request)
    {
        var item = await _db.Articles.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("UpdateArticle", nameof(ArticleEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("ARTICLE_NOT_FOUND", $"Article with ID '{id}' was not found.", statusCode: 404);
        }

        var validator = new Portfolio.Application.Validators.AdminArticleRequestValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("UpdateArticle", nameof(ArticleEntity), id.ToString(), false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid article payload.", errors, statusCode: 400);
        }

        var slugConflict = await _db.Articles.AnyAsync(x => x.Id != id && x.Slug.ToLower() == request.Slug.Trim().ToLower());
        if (slugConflict)
        {
            await LogAuditAsync("UpdateArticle_Failed", nameof(ArticleEntity), id.ToString(), false, $"{{\"slug\":\"{request.Slug}\",\"reason\":\"duplicate_slug\"}}");
            return FailResponse("DUPLICATE_SLUG", $"An article with slug '{request.Slug}' already exists.", statusCode: 409);
        }

        item.Slug = request.Slug.Trim();
        item.TitleEn = request.TitleEn.Trim();
        item.TitleAr = request.TitleAr?.Trim();
        item.SummaryEn = request.SummaryEn.Trim();
        item.SummaryAr = request.SummaryAr?.Trim();
        item.ContentEn = request.ContentEn;
        item.ContentAr = request.ContentAr;
        item.CoverImage = request.CoverImage?.Trim();
        item.Tags = request.Tags;
        item.Status = request.Status;
        item.PublicVisible = request.PublicVisible;
        if (request.PublishedAt.HasValue) item.PublishedAt = request.PublishedAt;
        item.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UpdateArticle", nameof(ArticleEntity), item.Id.ToString(), true, $"{{\"slug\":\"{item.Slug}\"}}");

        return OkResponse(MapAdminArticleDto(item));
    }

    [HttpDelete("articles/{id:guid}")]
    public async Task<IActionResult> DeleteArticle(Guid id)
    {
        var item = await _db.Articles.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("DeleteArticle", nameof(ArticleEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("ARTICLE_NOT_FOUND", $"Article with ID '{id}' was not found.", statusCode: 404);
        }

        _db.Articles.Remove(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DeleteArticle", nameof(ArticleEntity), id.ToString(), true, null);
        return StatusCode(204);
    }

    private static AdminArticleDto MapAdminArticleDto(ArticleEntity item) => new()
    {
        Id = item.Id,
        Slug = item.Slug,
        TitleEn = item.TitleEn,
        TitleAr = item.TitleAr,
        SummaryEn = item.SummaryEn,
        SummaryAr = item.SummaryAr,
        ContentEn = item.ContentEn,
        ContentAr = item.ContentAr,
        CoverImage = item.CoverImage,
        Tags = item.Tags,
        Status = item.Status.ToString().ToLowerInvariant(),
        PublicVisible = item.PublicVisible,
        PublishedAt = item.PublishedAt,
        CreatedAt = item.CreatedAt,
        UpdatedAt = item.UpdatedAt
    };
    #endregion

    #region Announcements CMS Admin
    [HttpGet("announcements")]
    public async Task<IActionResult> GetAdminAnnouncements()
    {
        var items = await _db.Announcements.AsNoTracking().OrderByDescending(x => x.Priority).ThenByDescending(x => x.CreatedAt).ToListAsync();
        var dtos = items.Select(MapAdminAnnouncementDto).ToList();
        return OkResponse(dtos);
    }

    [HttpGet("announcements/{id:guid}")]
    public async Task<IActionResult> GetAdminAnnouncementById(Guid id)
    {
        var item = await _db.Announcements.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        if (item == null) return FailResponse("ANNOUNCEMENT_NOT_FOUND", $"Announcement with ID '{id}' was not found.", statusCode: 404);
        return OkResponse(MapAdminAnnouncementDto(item));
    }

    [HttpPost("announcements")]
    public async Task<IActionResult> CreateAnnouncement([FromBody] AdminAnnouncementRequest request)
    {
        var validator = new Portfolio.Application.Validators.AdminAnnouncementRequestValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("CreateAnnouncement", nameof(AnnouncementEntity), null, false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid announcement payload.", errors, statusCode: 400);
        }

        var item = new AnnouncementEntity
        {
            TitleEn = request.TitleEn.Trim(),
            TitleAr = request.TitleAr?.Trim(),
            MessageEn = request.MessageEn.Trim(),
            MessageAr = request.MessageAr?.Trim(),
            LinkUrl = request.LinkUrl?.Trim(),
            LinkTextEn = request.LinkTextEn?.Trim(),
            LinkTextAr = request.LinkTextAr?.Trim(),
            Kind = request.Kind.Trim(),
            Priority = request.Priority,
            Status = request.Status,
            PublicVisible = request.PublicVisible,
            StartsAt = request.StartsAt,
            EndsAt = request.EndsAt
        };

        _db.Announcements.Add(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("CreateAnnouncement", nameof(AnnouncementEntity), item.Id.ToString(), true, $"{{\"title\":\"{item.TitleEn}\"}}");
        return StatusCode(201, ApiResponse<AdminAnnouncementDto>.Ok(MapAdminAnnouncementDto(item)));
    }

    [HttpPut("announcements/{id:guid}")]
    public async Task<IActionResult> UpdateAnnouncement(Guid id, [FromBody] AdminAnnouncementRequest request)
    {
        var item = await _db.Announcements.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("UpdateAnnouncement", nameof(AnnouncementEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("ANNOUNCEMENT_NOT_FOUND", $"Announcement with ID '{id}' was not found.", statusCode: 404);
        }

        var validator = new Portfolio.Application.Validators.AdminAnnouncementRequestValidator();
        var valResult = await validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            await LogAuditAsync("UpdateAnnouncement", nameof(AnnouncementEntity), id.ToString(), false, "{\"reason\":\"validation_failed\"}");
            return FailResponse("VALIDATION_ERROR", "Invalid announcement payload.", errors, statusCode: 400);
        }

        item.TitleEn = request.TitleEn.Trim();
        item.TitleAr = request.TitleAr?.Trim();
        item.MessageEn = request.MessageEn.Trim();
        item.MessageAr = request.MessageAr?.Trim();
        item.LinkUrl = request.LinkUrl?.Trim();
        item.LinkTextEn = request.LinkTextEn?.Trim();
        item.LinkTextAr = request.LinkTextAr?.Trim();
        item.Kind = request.Kind.Trim();
        item.Priority = request.Priority;
        item.Status = request.Status;
        item.PublicVisible = request.PublicVisible;
        item.StartsAt = request.StartsAt;
        item.EndsAt = request.EndsAt;
        item.UpdatedAt = DateTimeOffset.UtcNow;

        await _db.SaveChangesAsync();
        await LogAuditAsync("UpdateAnnouncement", nameof(AnnouncementEntity), item.Id.ToString(), true, $"{{\"title\":\"{item.TitleEn}\"}}");

        return OkResponse(MapAdminAnnouncementDto(item));
    }

    [HttpDelete("announcements/{id:guid}")]
    public async Task<IActionResult> DeleteAnnouncement(Guid id)
    {
        var item = await _db.Announcements.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            await LogAuditAsync("DeleteAnnouncement", nameof(AnnouncementEntity), id.ToString(), false, "{\"reason\":\"not_found\"}");
            return FailResponse("ANNOUNCEMENT_NOT_FOUND", $"Announcement with ID '{id}' was not found.", statusCode: 404);
        }

        _db.Announcements.Remove(item);
        await _db.SaveChangesAsync();

        await LogAuditAsync("DeleteAnnouncement", nameof(AnnouncementEntity), id.ToString(), true, null);
        return StatusCode(204);
    }

    private static AdminAnnouncementDto MapAdminAnnouncementDto(AnnouncementEntity item) => new()
    {
        Id = item.Id,
        TitleEn = item.TitleEn,
        TitleAr = item.TitleAr,
        MessageEn = item.MessageEn,
        MessageAr = item.MessageAr,
        LinkUrl = item.LinkUrl,
        LinkTextEn = item.LinkTextEn,
        LinkTextAr = item.LinkTextAr,
        Kind = item.Kind,
        Priority = item.Priority,
        Status = item.Status.ToString().ToLowerInvariant(),
        PublicVisible = item.PublicVisible,
        StartsAt = item.StartsAt,
        EndsAt = item.EndsAt,
        CreatedAt = item.CreatedAt,
        UpdatedAt = item.UpdatedAt
    };
    #endregion
}
