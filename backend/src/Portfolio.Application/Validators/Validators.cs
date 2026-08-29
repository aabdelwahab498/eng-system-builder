using FluentValidation;
using Portfolio.Application.DTOs;

namespace Portfolio.Application.Validators;

public class ContactMessageValidator : AbstractValidator<ContactMessageRequest>
{
    public ContactMessageValidator()
    {
        RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(200);
        RuleFor(x => x.Subject).MaximumLength(200);
        RuleFor(x => x.Message).NotEmpty().MaximumLength(4000);
    }
}

public class AnalyticsEventValidator : AbstractValidator<AnalyticsEventRequest>
{
    public AnalyticsEventValidator()
    {
        RuleFor(x => x.EventName).NotEmpty().MaximumLength(100);
        RuleFor(x => x.Path).MaximumLength(500);
    }
}

public class ConsentRecordValidator : AbstractValidator<ConsentRecordRequest>
{
    public ConsentRecordValidator()
    {
        RuleFor(x => x.VisitorId).NotEmpty().MaximumLength(100);
    }
}

public class LoginRequestValidator : AbstractValidator<LoginRequest>
{
    public LoginRequestValidator()
    {
        RuleFor(x => x.Email).NotEmpty().EmailAddress().MaximumLength(200);
        RuleFor(x => x.Password).NotEmpty().MinimumLength(6).MaximumLength(100);
    }
}

