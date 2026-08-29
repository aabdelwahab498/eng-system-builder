using Xunit;
using Portfolio.Domain;
using Portfolio.Domain.Entities;
using Portfolio.Application.Validators;
using Portfolio.Application.DTOs;

namespace Portfolio.UnitTests;

public class DomainAndValidationTests
{
    [Fact]
    public void IsPublishable_ShouldReturnTrue_WhenVerifiedAndPublicVisible()
    {
        var project = new ProjectEntity
        {
            Slug = "test-project",
            TitleEn = "Test Project",
            TaglineEn = "Tagline",
            RoleEn = "Developer",
            SummaryEn = "Summary",
            ProblemEn = "Problem",
            ApproachEn = "Approach",
            Status = ContentStatus.Verified,
            PublicVisible = true
        };

        Assert.True(project.IsPublishable);
    }

    [Fact]
    public void IsPublishable_ShouldReturnFalse_WhenPrivateOrNotPublic()
    {
        var project = new ProjectEntity
        {
            Slug = "private-project",
            TitleEn = "Private Project",
            TaglineEn = "Tagline",
            RoleEn = "Developer",
            SummaryEn = "Summary",
            ProblemEn = "Problem",
            ApproachEn = "Approach",
            Status = ContentStatus.Private,
            PublicVisible = true
        };

        Assert.False(project.IsPublishable);
    }

    [Fact]
    public void ContactValidator_ShouldValidateCorrectly()
    {
        var validator = new ContactMessageValidator();
        var validRequest = new ContactMessageRequest
        {
            Name = "John Doe",
            Email = "john@example.com",
            Subject = "Architecture Inquiry",
            Message = "Valid message body."
        };

        var result = validator.Validate(validRequest);
        Assert.True(result.IsValid);

        var invalidRequest = new ContactMessageRequest
        {
            Name = "",
            Email = "invalid-email",
            Subject = "",
            Message = ""
        };

        var invalidResult = validator.Validate(invalidRequest);
        Assert.False(invalidResult.IsValid);
        Assert.Equal(3, invalidResult.Errors.Count);
    }
}
