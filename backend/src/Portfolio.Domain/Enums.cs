namespace Portfolio.Domain;

public enum ContentStatus
{
    Verified,
    Draft,
    NeedsVerification,
    Placeholder,
    Private,
    Deprecated
}

public enum SourceType
{
    Github,
    Linkedin,
    Cv,
    UserProvided,
    ProjectDocumentation,
    Portfolio,
    Other
}

public enum ExperienceCategory
{
    Engineering,
    Product,
    Academic,
    Operations,
    Marketing,
    Other
}

public enum OrganizationType
{
    Company,
    Startup,
    Agency,
    Academic,
    Government,
    Self
}

public enum SkillCategoryId
{
    Backend,
    Frontend,
    Mobile,
    Ai,
    Databases,
    DevOps,
    Languages,
    Tools,
    Business
}

public enum ProficiencyLabel
{
    Working,
    Production,
    Primary
}

public enum ProjectCategory
{
    Web,
    Backend,
    Frontend,
    Mobile,
    Ai,
    Saas,
    Infrastructure,
    DigitalProduct
}

public enum ProjectStatus
{
    Live,
    Beta,
    InDevelopment,
    ComingSoon,
    Archived
}

public enum ProductCategory
{
    Saas,
    AiTool,
    DeveloperTool,
    Template,
    DigitalDownload,
    Course,
    Other
}

public enum ProductStatus
{
    Live,
    Beta,
    InDevelopment,
    ComingSoon
}
