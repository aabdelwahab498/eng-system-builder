using System;

namespace Portfolio.Domain.Entities;

public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    public DateTimeOffset UpdatedAt { get; set; } = DateTimeOffset.UtcNow;

    public ContentStatus Status { get; set; } = ContentStatus.Verified;
    public SourceType SourceType { get; set; } = SourceType.Portfolio;
    public string? Source { get; set; }
    public DateTimeOffset? VerifiedAt { get; set; }

    public bool PublicVisible { get; set; } = true;
    public bool PortfolioVisible { get; set; } = true;
    public bool CvVisible { get; set; } = true;
    public bool LinkedinVisible { get; set; } = true;

    public bool IsPublishable =>
        (Status == ContentStatus.Verified || Status == ContentStatus.Draft) && PublicVisible;
}
