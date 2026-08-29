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

public class AdminPaymentSubmissionDto
{
    public Guid Id { get; set; }
    public required string ClientName { get; set; }
    public string? Email { get; set; }
    public string? Whatsapp { get; set; }
    public string? ServiceId { get; set; }
    public string? ServiceTitle { get; set; }
    public string? ProjectName { get; set; }
    public string? Amount { get; set; }
    public string? Currency { get; set; }
    public string? MethodId { get; set; }
    public string? ProofPath { get; set; }
    public string? ProofFilename { get; set; }
    public string? ProofType { get; set; }
    public long? ProofSizeBytes { get; set; }
    public required string StatusState { get; set; }
    public string? AdminNote { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class UpdatePaymentSubmissionStatusRequest
{
    public required string StatusState { get; set; }
}

public class UpdatePaymentSubmissionNoteRequest
{
    public required string AdminNote { get; set; }
}

public class SubmitPaymentProofRequest
{
    public string? ClientName { get; set; }
    public string? Email { get; set; }
    public string? Whatsapp { get; set; }
    public string? ServiceId { get; set; }
    public string? ServiceTitle { get; set; }
    public string? ProjectName { get; set; }
    public string? Amount { get; set; }
    public string? Currency { get; set; }
    public string? MethodId { get; set; }
    public string? ProofPath { get; set; }
    public string? ProofFilename { get; set; }
    public string? ProofType { get; set; }
    public long? ProofSizeBytes { get; set; }
    public string? Locale { get; set; }
}

public class PaymentProofSignedUrlDto
{
    public required string Url { get; set; }
}

public class AdminMediaAssetDto
{
    public Guid Id { get; set; }
    public required string Filename { get; set; }
    public required string StoragePath { get; set; }
    public required string PublicUrl { get; set; }
    public string? MimeType { get; set; }
    public long? SizeBytes { get; set; }
    public string? AltEn { get; set; }
    public string? AltAr { get; set; }
    public string? CaptionEn { get; set; }
    public string? CaptionAr { get; set; }
    public bool Archived { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class RegisterMediaAssetRequest
{
    public required string Filename { get; set; }
    public required string StoragePath { get; set; }
    public string? PublicUrl { get; set; }
    public string? MimeType { get; set; }
    public long? SizeBytes { get; set; }
    public string? AltEn { get; set; }
    public string? AltAr { get; set; }
    public string? CaptionEn { get; set; }
    public string? CaptionAr { get; set; }
}

public class UpdateMediaAssetRequest
{
    public string? AltEn { get; set; }
    public string? AltAr { get; set; }
    public string? CaptionEn { get; set; }
    public string? CaptionAr { get; set; }
    public bool Archived { get; set; }
}

public class AdminClientDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Email { get; set; }
    public string? Whatsapp { get; set; }
    public string? Country { get; set; }
    public string? Service { get; set; }
    public string? Projects { get; set; }
    public string? PaymentStatus { get; set; }
    public required string Status { get; set; }
    public string? Plan { get; set; }
    public string? SubscriptionState { get; set; }
    public string? PaymentState { get; set; }
    public string? PaymentMethod { get; set; }
    public string? Amount { get; set; }
    public string? Currency { get; set; }
    public string? PaidAmount { get; set; }
    public string? LastPaymentAt { get; set; }
    public string? NextRenewalAt { get; set; }
    public string? InvoiceRef { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class CreateClientRequest
{
    public required string Name { get; set; }
    public string? Email { get; set; }
    public string? Whatsapp { get; set; }
    public string? Country { get; set; }
    public string? Service { get; set; }
    public string? Projects { get; set; }
    public string? PaymentStatus { get; set; }
    public string? Status { get; set; }
    public string? Plan { get; set; }
    public string? SubscriptionState { get; set; }
    public string? PaymentState { get; set; }
    public string? PaymentMethod { get; set; }
    public string? Amount { get; set; }
    public string? Currency { get; set; }
    public string? PaidAmount { get; set; }
    public string? LastPaymentAt { get; set; }
    public string? NextRenewalAt { get; set; }
    public string? InvoiceRef { get; set; }
}

public class UpdateClientRequest
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Whatsapp { get; set; }
    public string? Country { get; set; }
    public string? Service { get; set; }
    public string? Projects { get; set; }
    public string? PaymentStatus { get; set; }
    public string? Status { get; set; }
    public string? Plan { get; set; }
    public string? SubscriptionState { get; set; }
    public string? PaymentState { get; set; }
    public string? PaymentMethod { get; set; }
    public string? Amount { get; set; }
    public string? Currency { get; set; }
    public string? PaidAmount { get; set; }
    public string? LastPaymentAt { get; set; }
    public string? NextRenewalAt { get; set; }
    public string? InvoiceRef { get; set; }
}

public class AdminInvoiceDto
{
    public Guid Id { get; set; }
    public required string ClientId { get; set; }
    public required string Amount { get; set; }
    public required string Currency { get; set; }
    public required string Method { get; set; }
    public required string Status { get; set; }
    public required string InvoiceRef { get; set; }
    public string? Note { get; set; }
    public required string PaidAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class CreateInvoiceRequest
{
    public required string ClientId { get; set; }
    public required string Amount { get; set; }
    public required string Currency { get; set; }
    public required string Method { get; set; }
    public string? Status { get; set; }
    public required string InvoiceRef { get; set; }
    public string? Note { get; set; }
    public string? PaidAt { get; set; }
}

public class UpdateInvoiceStatusRequest
{
    public required string Status { get; set; }
}

public class AdminDistributionConfigDto
{
    public string? DistributionJson { get; set; }
    public string? PixelConfigsJson { get; set; }
    public string? AdCampaignsJson { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class UpdateDistributionConfigRequest
{
    public string? DistributionJson { get; set; }
    public string? PixelConfigsJson { get; set; }
    public string? AdCampaignsJson { get; set; }
}

public class AdminArticleDto
{
    public Guid Id { get; set; }
    public required string Slug { get; set; }
    public required string TitleEn { get; set; }
    public string? TitleAr { get; set; }
    public required string SummaryEn { get; set; }
    public string? SummaryAr { get; set; }
    public required string ContentEn { get; set; }
    public string? ContentAr { get; set; }
    public string? CoverImage { get; set; }
    public List<string> Tags { get; set; } = [];
    public required string Status { get; set; }
    public bool PublicVisible { get; set; } = true;
    public DateTimeOffset? PublishedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class AdminArticleRequest
{
    public required string Slug { get; set; }
    public required string TitleEn { get; set; }
    public string? TitleAr { get; set; }
    public required string SummaryEn { get; set; }
    public string? SummaryAr { get; set; }
    public required string ContentEn { get; set; }
    public string? ContentAr { get; set; }
    public string? CoverImage { get; set; }
    public List<string> Tags { get; set; } = [];
    public ContentStatus Status { get; set; } = ContentStatus.Draft;
    public bool PublicVisible { get; set; } = true;
    public DateTimeOffset? PublishedAt { get; set; }
}

public class AdminAnnouncementDto
{
    public Guid Id { get; set; }
    public required string TitleEn { get; set; }
    public string? TitleAr { get; set; }
    public required string MessageEn { get; set; }
    public string? MessageAr { get; set; }
    public string? LinkUrl { get; set; }
    public string? LinkTextEn { get; set; }
    public string? LinkTextAr { get; set; }
    public required string Kind { get; set; }
    public int Priority { get; set; }
    public required string Status { get; set; }
    public bool PublicVisible { get; set; } = true;
    public DateTimeOffset StartsAt { get; set; }
    public DateTimeOffset? EndsAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset UpdatedAt { get; set; }
}

public class AdminAnnouncementRequest
{
    public required string TitleEn { get; set; }
    public string? TitleAr { get; set; }
    public required string MessageEn { get; set; }
    public string? MessageAr { get; set; }
    public string? LinkUrl { get; set; }
    public string? LinkTextEn { get; set; }
    public string? LinkTextAr { get; set; }
    public string Kind { get; set; } = "info";
    public int Priority { get; set; } = 0;
    public ContentStatus Status { get; set; } = ContentStatus.Verified;
    public bool PublicVisible { get; set; } = true;
    public DateTimeOffset StartsAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset? EndsAt { get; set; }
}




