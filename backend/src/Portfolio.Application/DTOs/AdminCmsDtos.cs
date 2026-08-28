using System;
using System.Collections.Generic;
using Portfolio.Domain;
using Portfolio.Domain.Entities;

namespace Portfolio.Application.DTOs;

public class AdminProjectRequest
{
    public required string Slug { get; set; }
    public required string TitleEn { get; set; }
    public string? TitleAr { get; set; }
    public required string TaglineEn { get; set; }
    public string? TaglineAr { get; set; }
    public ProjectCategory Category { get; set; } = ProjectCategory.Web;
    public List<string> Platform { get; set; } = [];
    public ProjectStatus Lifecycle { get; set; } = ProjectStatus.Live;
    public required string RoleEn { get; set; }
    public string? RoleAr { get; set; }
    public string? Timeframe { get; set; }
    public required string SummaryEn { get; set; }
    public string? SummaryAr { get; set; }
    public required string ProblemEn { get; set; }
    public string? ProblemAr { get; set; }
    public required string ApproachEn { get; set; }
    public string? ApproachAr { get; set; }
    public List<string> ArchitectureEn { get; set; } = [];
    public List<string> ArchitectureAr { get; set; } = [];
    public List<string> FeaturesEn { get; set; } = [];
    public List<string> FeaturesAr { get; set; } = [];
    public List<string> Technologies { get; set; } = [];
    public List<string> OutcomesEn { get; set; } = [];
    public List<string> OutcomesAr { get; set; } = [];
    public string? RepoUrl { get; set; }
    public string? LiveUrl { get; set; }
    public string? DocsUrl { get; set; }
    public string? ApiUrl { get; set; }
    public bool Featured { get; set; }
    public bool PublicVisible { get; set; } = true;
}

public class AdminExperienceRequest
{
    public required string Company { get; set; }
    public OrganizationType OrganizationType { get; set; } = OrganizationType.Company;
    public required string PositionEn { get; set; }
    public string? PositionAr { get; set; }
    public string? Location { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public bool Current { get; set; }
    public required string DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public List<string> ResponsibilitiesEn { get; set; } = [];
    public List<string> ResponsibilitiesAr { get; set; } = [];
    public List<string> AchievementsEn { get; set; } = [];
    public List<string> AchievementsAr { get; set; } = [];
    public List<string> Technologies { get; set; } = [];
    public ExperienceCategory Category { get; set; } = ExperienceCategory.Engineering;
    public bool PublicVisible { get; set; } = true;
}

public class AdminEducationRequest
{
    public required string Institution { get; set; }
    public required string DegreeEn { get; set; }
    public string? DegreeAr { get; set; }
    public required string FieldEn { get; set; }
    public string? FieldAr { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public string? GraduationDate { get; set; }
    public string? DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public bool PublicVisible { get; set; } = true;
}

public class AdminSkillGroupRequest
{
    public SkillCategoryId Category { get; set; }
    public required string LabelEn { get; set; }
    public string? LabelAr { get; set; }
    public required string DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public bool PublicVisible { get; set; } = true;
}

public class AdminSkillRequest
{
    public Guid SkillGroupId { get; set; }
    public required string Name { get; set; }
    public SkillCategoryId Category { get; set; }
    public required string ContextEn { get; set; }
    public string? ContextAr { get; set; }
    public ProficiencyLabel? ProficiencyLabel { get; set; }
    public string? Emphasis { get; set; }
    public bool Featured { get; set; }
    public bool PublicVisible { get; set; } = true;
}

public class AdminServiceRequest
{
    public required string TitleEn { get; set; }
    public string? TitleAr { get; set; }
    public required string SummaryEn { get; set; }
    public string? SummaryAr { get; set; }
    public required string DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public List<string> CapabilitiesEn { get; set; } = [];
    public List<string> CapabilitiesAr { get; set; } = [];
    public List<string> DeliverablesEn { get; set; } = [];
    public List<string> DeliverablesAr { get; set; } = [];
    public List<string> IdealForEn { get; set; } = [];
    public List<string> IdealForAr { get; set; } = [];
    public List<string> RelatedProjects { get; set; } = [];
    public bool PublicVisible { get; set; } = true;
}

public class AdminProductRequest
{
    public required string Slug { get; set; }
    public required string NameEn { get; set; }
    public string? NameAr { get; set; }
    public ProductCategory Category { get; set; } = ProductCategory.Saas;
    public ProductStatus Lifecycle { get; set; } = ProductStatus.Live;
    public required string TaglineEn { get; set; }
    public string? TaglineAr { get; set; }
    public required string SummaryEn { get; set; }
    public string? SummaryAr { get; set; }
    public required string DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public List<string> FeaturesEn { get; set; } = [];
    public List<string> FeaturesAr { get; set; } = [];
    public List<string> Technologies { get; set; } = [];
    public string? ExternalUrl { get; set; }
    public string? DemoUrl { get; set; }
    public string? DocsUrl { get; set; }
    public bool PublicVisible { get; set; } = true;
}

public class AdminCourseRequest
{
    public required string Slug { get; set; }
    public required string TitleEn { get; set; }
    public string? TitleAr { get; set; }
    public int Order { get; set; }
    public string? Url { get; set; }
    public bool PublicVisible { get; set; } = true;
}

public class AdminContactMessageDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Subject { get; set; }
    public required string Message { get; set; }
    public string? IpAddress { get; set; }
    public required string StatusState { get; set; }
    public string? AdminNote { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class UpdateContactRequestStatusRequest
{
    public required string StatusState { get; set; }
}

public class UpdateContactRequestNoteRequest
{
    public required string AdminNote { get; set; }
}
