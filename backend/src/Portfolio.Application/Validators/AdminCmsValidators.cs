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

public class UpdateContactRequestStatusValidator : AbstractValidator<UpdateContactRequestStatusRequest>
{
    private static readonly string[] AllowedStatuses =
    [
        "new",
        "contacted",
        "proposal_sent",
        "deposit_pending",
        "in_progress",
        "completed",
        "cancelled"
    ];

    public UpdateContactRequestStatusValidator()
    {
        RuleFor(x => x.StatusState)
            .NotEmpty()
            .Must(s => Array.Exists(AllowedStatuses, st => string.Equals(st, s, StringComparison.OrdinalIgnoreCase)))
            .WithMessage("StatusState must be one of: new, contacted, proposal_sent, deposit_pending, in_progress, completed, cancelled.");
    }
}

public class UpdateContactRequestNoteValidator : AbstractValidator<UpdateContactRequestNoteRequest>
{
    public UpdateContactRequestNoteValidator()
    {
        RuleFor(x => x.AdminNote)
            .NotNull()
            .MaximumLength(4000);
    }
}

public class UpdatePaymentSubmissionStatusValidator : AbstractValidator<UpdatePaymentSubmissionStatusRequest>
{
    private static readonly string[] AllowedStatuses =
    [
        "pending_review",
        "approved",
        "rejected",
        "needs_more_information"
    ];

    public UpdatePaymentSubmissionStatusValidator()
    {
        RuleFor(x => x.StatusState)
            .NotEmpty()
            .Must(s => Array.Exists(AllowedStatuses, st => string.Equals(st, s, StringComparison.OrdinalIgnoreCase)))
            .WithMessage("StatusState must be one of: pending_review, approved, rejected, needs_more_information.");
    }
}

public class UpdatePaymentSubmissionNoteValidator : AbstractValidator<UpdatePaymentSubmissionNoteRequest>
{
    public UpdatePaymentSubmissionNoteValidator()
    {
        RuleFor(x => x.AdminNote)
            .NotNull()
            .MaximumLength(4000);
    }
}

public class SubmitPaymentProofValidator : AbstractValidator<SubmitPaymentProofRequest>
{
    public SubmitPaymentProofValidator()
    {
        RuleFor(x => x.ClientName).MaximumLength(120);
        RuleFor(x => x.Email).MaximumLength(255);
        RuleFor(x => x.Whatsapp).MaximumLength(40);
        RuleFor(x => x.ServiceId).MaximumLength(80);
        RuleFor(x => x.ServiceTitle).MaximumLength(160);
        RuleFor(x => x.ProjectName).MaximumLength(160);
        RuleFor(x => x.Amount).MaximumLength(40);
        RuleFor(x => x.Currency).MaximumLength(8);
        RuleFor(x => x.MethodId).MaximumLength(80);
        RuleFor(x => x.ProofPath)
            .MaximumLength(500)
            .Must(path => string.IsNullOrEmpty(path) || (!path.Contains("..") && path.StartsWith("proofs/")))
            .WithMessage("Invalid proof path.");
        RuleFor(x => x.ProofFilename).MaximumLength(255);
        RuleFor(x => x.ProofType).MaximumLength(80);
        RuleFor(x => x.Locale).MaximumLength(5);
    }
}
