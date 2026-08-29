using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Portfolio.Application.DTOs;

public class ApiResponse<T>
{
    public bool Success { get; set; } = true;
    public T? Data { get; set; }
    public ApiError? Error { get; set; }
    public ApiMeta Meta { get; set; } = new();

    public static ApiResponse<T> Ok(T data, string locale = "en", string correlationId = "")
    {
        return new ApiResponse<T>
        {
            Success = true,
            Data = data,
            Meta = new ApiMeta { Locale = locale, CorrelationId = correlationId }
        };
    }

    public static ApiResponse<T> Fail(string code, string message, List<string>? details = null, string correlationId = "")
    {
        return new ApiResponse<T>
        {
            Success = false,
            Data = default,
            Error = new ApiError { Code = code, Message = message, Details = details ?? [] },
            Meta = new ApiMeta { CorrelationId = correlationId }
        };
    }
}

public class ApiError
{
    public required string Code { get; set; }
    public required string Message { get; set; }
    public List<string> Details { get; set; } = [];
}

public class ApiMeta
{
    public DateTimeOffset Timestamp { get; set; } = DateTimeOffset.UtcNow;
    public string Locale { get; set; } = "en";
    public string CorrelationId { get; set; } = string.Empty;
}

public class ExperienceDto
{
    public Guid Id { get; set; }
    public required string Company { get; set; }
    public string OrganizationType { get; set; } = "company";
    public required string Position { get; set; }
    public string? Location { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public bool Current { get; set; }
    public required string Description { get; set; }
    public List<string> Responsibilities { get; set; } = [];
    public List<string> Achievements { get; set; } = [];
    public List<string> Technologies { get; set; } = [];
    public string Category { get; set; } = "engineering";
}

public class EducationDto
{
    public Guid Id { get; set; }
    public required string Institution { get; set; }
    public required string Degree { get; set; }
    public required string Field { get; set; }
    public string? StartDate { get; set; }
    public string? EndDate { get; set; }
    public string? GraduationDate { get; set; }
    public string? Description { get; set; }
}

public class CertificationDto
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public required string Issuer { get; set; }
    public string? IssuedAt { get; set; }
    public string? CredentialUrl { get; set; }
}

public class SkillDto
{
    public required string Name { get; set; }
    public required string Category { get; set; }
    public required string Context { get; set; }
    public string? ProficiencyLabel { get; set; }
    public string? Emphasis { get; set; }
    public bool Featured { get; set; }
    public bool PortfolioVisible { get; set; }
}

public class SkillGroupDto
{
    public required string Id { get; set; }
    public required string Category { get; set; }
    public required string Label { get; set; }
    public required string Description { get; set; }
    public List<SkillDto> Skills { get; set; } = [];
}

public class ProjectDto
{
    public Guid Id { get; set; }
    public required string Slug { get; set; }
    public required string Title { get; set; }
    public required string Tagline { get; set; }
    public required string Category { get; set; }
    public List<string> Platform { get; set; } = [];
    public required string Lifecycle { get; set; }
    public required string Role { get; set; }
    public string? Timeframe { get; set; }
    public required string Summary { get; set; }
    public required string Problem { get; set; }
    public required string Approach { get; set; }
    public List<string> Architecture { get; set; } = [];
    public List<string> Features { get; set; } = [];
    public List<string> Technologies { get; set; } = [];
    public List<string> Outcomes { get; set; } = [];
    public string? RepoUrl { get; set; }
    public string? LiveUrl { get; set; }
    public bool Featured { get; set; }
}

public class ProductDto
{
    public Guid Id { get; set; }
    public required string Slug { get; set; }
    public required string Name { get; set; }
    public required string Category { get; set; }
    public required string Lifecycle { get; set; }
    public required string Tagline { get; set; }
    public required string Summary { get; set; }
    public required string Description { get; set; }
    public List<string> Features { get; set; } = [];
    public List<string> Technologies { get; set; } = [];
    public string? ExternalUrl { get; set; }
    public string? DemoUrl { get; set; }
}

public class ServiceDto
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Summary { get; set; }
    public required string Description { get; set; }
    public List<string> Capabilities { get; set; } = [];
    public List<string> Deliverables { get; set; } = [];
    public List<string> IdealFor { get; set; } = [];
}

public class CourseDto
{
    public Guid Id { get; set; }
    public required string Slug { get; set; }
    public required string Title { get; set; }
    public int Order { get; set; }
    public string? Url { get; set; }
}

public class ContactMessageRequest
{
    private string? _name;

    [JsonPropertyName("name")]
    public string Name
    {
        get => !string.IsNullOrWhiteSpace(_name) ? _name : (FullName ?? string.Empty);
        set => _name = value;
    }

    [JsonPropertyName("full_name")]
    public string? FullName { get; set; }

    [JsonPropertyName("email")]
    public required string Email { get; set; }

    [JsonPropertyName("subject")]
    public string? Subject { get; set; }

    [JsonPropertyName("message")]
    public required string Message { get; set; }

    [JsonPropertyName("service")]
    public string? Service { get; set; }

    [JsonPropertyName("service_id")]
    public string? ServiceId { get; set; }

    [JsonPropertyName("service_title")]
    public string? ServiceTitle { get; set; }

    [JsonPropertyName("project_name")]
    public string? ProjectName { get; set; }

    [JsonPropertyName("whatsapp")]
    public string? Whatsapp { get; set; }

    [JsonPropertyName("scope")]
    public string? Scope { get; set; }

    [JsonPropertyName("budget")]
    public string? Budget { get; set; }

    [JsonPropertyName("timeline")]
    public string? Timeline { get; set; }

    [JsonPropertyName("preferred_channel")]
    public string? PreferredChannel { get; set; }

    [JsonPropertyName("platform")]
    public string? Platform { get; set; }

    [JsonPropertyName("attachment_url")]
    public string? AttachmentUrl { get; set; }

    [JsonPropertyName("locale")]
    public string? Locale { get; set; }

    [JsonPropertyName("source")]
    public string? Source { get; set; }
}

public class AnalyticsEventRequest
{
    public required string EventName { get; set; }
    public string? Category { get; set; }
    public string? Path { get; set; }
    public string? SessionId { get; set; }
    public string? MetadataJson { get; set; }
}

public class ConsentRecordRequest
{
    public required string VisitorId { get; set; }
    public bool AnalyticsConsent { get; set; }
    public bool MarketingConsent { get; set; }
}

public class LoginRequest
{
    public required string Email { get; set; }
    public required string Password { get; set; }
}

public class LoginResponse
{
    public required string Token { get; set; }
    public DateTimeOffset ExpiresAt { get; set; }
    public required UserDto User { get; set; }
}

public class UserDto
{
    public required string Id { get; set; }
    public required string Email { get; set; }
    public List<string> Roles { get; set; } = [];
}

public class ArticleDto
{
    public Guid Id { get; set; }
    public required string Slug { get; set; }
    public required string Title { get; set; }
    public required string Summary { get; set; }
    public required string Content { get; set; }
    public string? CoverImage { get; set; }
    public List<string> Tags { get; set; } = [];
    public DateTimeOffset? PublishedAt { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
}

public class AnnouncementDto
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Message { get; set; }
    public string? LinkUrl { get; set; }
    public string? LinkText { get; set; }
    public required string Kind { get; set; }
    public int Priority { get; set; }
    public DateTimeOffset StartsAt { get; set; }
    public DateTimeOffset? EndsAt { get; set; }
}



