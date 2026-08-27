using System;
using System.Collections.Generic;

namespace Portfolio.Domain.Entities;

public class ExperienceEntity : BaseEntity
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
}

public class EducationEntity : BaseEntity
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
}

public class CertificationEntity : BaseEntity
{
    public required string NameEn { get; set; }
    public string? NameAr { get; set; }
    public required string Issuer { get; set; }
    public string? IssuedAt { get; set; }
    public string? CredentialUrl { get; set; }
}

public class SkillGroupEntity : BaseEntity
{
    public SkillCategoryId Category { get; set; }
    public required string LabelEn { get; set; }
    public string? LabelAr { get; set; }
    public required string DescriptionEn { get; set; }
    public string? DescriptionAr { get; set; }
    public List<SkillEntity> Skills { get; set; } = [];
}

public class SkillEntity : BaseEntity
{
    public Guid SkillGroupId { get; set; }
    public SkillGroupEntity? SkillGroup { get; set; }
    public required string Name { get; set; }
    public SkillCategoryId Category { get; set; }
    public required string ContextEn { get; set; }
    public string? ContextAr { get; set; }
    public ProficiencyLabel? ProficiencyLabel { get; set; }
    public string? Emphasis { get; set; }
    public bool Featured { get; set; }
}

public class ProjectEntity : BaseEntity
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
}

public class ProductEntity : BaseEntity
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
    public Guid? RelatedProjectId { get; set; }
}

public class ServiceEntity : BaseEntity
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
}

public class CourseEntity : BaseEntity
{
    public required string Slug { get; set; }
    public required string TitleEn { get; set; }
    public string? TitleAr { get; set; }
    public int Order { get; set; }
    public string? Url { get; set; }
}

public class ContactMessageEntity : BaseEntity
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public required string Subject { get; set; }
    public required string Message { get; set; }
    public string? IpAddress { get; set; }
    public string StatusState { get; set; } = "Received";
}

public class AnalyticsEventEntity : BaseEntity
{
    public required string EventName { get; set; }
    public string? Category { get; set; }
    public string? Path { get; set; }
    public string? SessionId { get; set; }
    public string? MetadataJson { get; set; }
}

public class ConsentRecordEntity : BaseEntity
{
    public required string VisitorId { get; set; }
    public bool AnalyticsConsent { get; set; }
    public bool MarketingConsent { get; set; }
}

public class AuditLogEntity : BaseEntity
{
    public required string User { get; set; }
    public required string Action { get; set; }
    public required string EntityName { get; set; }
    public string? EntityId { get; set; }
    public string? ChangesJson { get; set; }
}
