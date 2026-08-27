using System;
using FluentValidation;
using Portfolio.Application.DTOs;

namespace Portfolio.Application.Validators;

public class AdminProjectValidator : AbstractValidator<AdminProjectRequest>
{
    public AdminProjectValidator()
    {
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(150);
        RuleFor(x => x.TitleEn).NotEmpty().MaximumLength(200);
        RuleFor(x => x.TaglineEn).NotEmpty().MaximumLength(300);
        RuleFor(x => x.RoleEn).NotEmpty().MaximumLength(200);
        RuleFor(x => x.SummaryEn).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.ProblemEn).NotEmpty().MaximumLength(4000);
        RuleFor(x => x.ApproachEn).NotEmpty().MaximumLength(4000);
        RuleFor(x => x.RepoUrl).Must(BeAValidUrl!).When(x => !string.IsNullOrWhiteSpace(x.RepoUrl)).WithMessage("RepoUrl must be a valid URL.");
        RuleFor(x => x.LiveUrl).Must(BeAValidUrl!).When(x => !string.IsNullOrWhiteSpace(x.LiveUrl)).WithMessage("LiveUrl must be a valid URL.");
    }

    private static bool BeAValidUrl(string url)
    {
        return Uri.TryCreate(url, UriKind.Absolute, out var uriResult)
               && (uriResult.Scheme == Uri.UriSchemeHttp || uriResult.Scheme == Uri.UriSchemeHttps);
    }
}

public class AdminExperienceValidator : AbstractValidator<AdminExperienceRequest>
{
    public AdminExperienceValidator()
    {
        RuleFor(x => x.Company).NotEmpty().MaximumLength(200);
        RuleFor(x => x.PositionEn).NotEmpty().MaximumLength(200);
        RuleFor(x => x.DescriptionEn).NotEmpty().MaximumLength(4000);
    }
}

public class AdminEducationValidator : AbstractValidator<AdminEducationRequest>
{
    public AdminEducationValidator()
    {
        RuleFor(x => x.Institution).NotEmpty().MaximumLength(200);
        RuleFor(x => x.DegreeEn).NotEmpty().MaximumLength(200);
        RuleFor(x => x.FieldEn).NotEmpty().MaximumLength(200);
    }
}

public class AdminSkillGroupValidator : AbstractValidator<AdminSkillGroupRequest>
{
    public AdminSkillGroupValidator()
    {
        RuleFor(x => x.LabelEn).NotEmpty().MaximumLength(200);
        RuleFor(x => x.DescriptionEn).NotEmpty().MaximumLength(1000);
    }
}

public class AdminSkillValidator : AbstractValidator<AdminSkillRequest>
{
    public AdminSkillValidator()
    {
        RuleFor(x => x.SkillGroupId).NotEmpty();
        RuleFor(x => x.Name).NotEmpty().MaximumLength(150);
        RuleFor(x => x.ContextEn).NotEmpty().MaximumLength(1000);
    }
}

public class AdminServiceValidator : AbstractValidator<AdminServiceRequest>
{
    public AdminServiceValidator()
    {
        RuleFor(x => x.TitleEn).NotEmpty().MaximumLength(200);
        RuleFor(x => x.SummaryEn).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.DescriptionEn).NotEmpty().MaximumLength(4000);
    }
}

public class AdminProductValidator : AbstractValidator<AdminProductRequest>
{
    public AdminProductValidator()
    {
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(150);
        RuleFor(x => x.NameEn).NotEmpty().MaximumLength(200);
        RuleFor(x => x.TaglineEn).NotEmpty().MaximumLength(300);
        RuleFor(x => x.SummaryEn).NotEmpty().MaximumLength(2000);
        RuleFor(x => x.DescriptionEn).NotEmpty().MaximumLength(4000);
    }
}

public class AdminCourseValidator : AbstractValidator<AdminCourseRequest>
{
    public AdminCourseValidator()
    {
        RuleFor(x => x.Slug).NotEmpty().MaximumLength(150);
        RuleFor(x => x.TitleEn).NotEmpty().MaximumLength(200);
    }
}
