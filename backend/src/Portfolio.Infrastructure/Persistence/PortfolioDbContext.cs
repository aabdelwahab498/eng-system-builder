using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;

namespace Portfolio.Infrastructure.Persistence;

public class PortfolioDbContext : DbContext
{
    public PortfolioDbContext(DbContextOptions<PortfolioDbContext> options) : base(options) { }

    public DbSet<ExperienceEntity> Experiences => Set<ExperienceEntity>();
    public DbSet<EducationEntity> Educations => Set<EducationEntity>();
    public DbSet<CertificationEntity> Certifications => Set<CertificationEntity>();
    public DbSet<SkillGroupEntity> SkillGroups => Set<SkillGroupEntity>();
    public DbSet<SkillEntity> Skills => Set<SkillEntity>();
    public DbSet<ProjectEntity> Projects => Set<ProjectEntity>();
    public DbSet<ProductEntity> Products => Set<ProductEntity>();
    public DbSet<ServiceEntity> Services => Set<ServiceEntity>();
    public DbSet<CourseEntity> Courses => Set<CourseEntity>();
    public DbSet<ContactMessageEntity> ContactMessages => Set<ContactMessageEntity>();
    public DbSet<AnalyticsEventEntity> AnalyticsEvents => Set<AnalyticsEventEntity>();
    public DbSet<ConsentRecordEntity> ConsentRecords => Set<ConsentRecordEntity>();
    public DbSet<AuditLogEntity> AuditLogs => Set<AuditLogEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<ExperienceEntity>().ToTable("experiences");
        modelBuilder.Entity<EducationEntity>().ToTable("educations");
        modelBuilder.Entity<CertificationEntity>().ToTable("certifications");
        modelBuilder.Entity<SkillGroupEntity>().ToTable("skill_groups");
        modelBuilder.Entity<SkillEntity>().ToTable("skills");
        modelBuilder.Entity<ProjectEntity>().ToTable("projects");
        modelBuilder.Entity<ProductEntity>().ToTable("products");
        modelBuilder.Entity<ServiceEntity>().ToTable("services");
        modelBuilder.Entity<CourseEntity>().ToTable("courses");
        modelBuilder.Entity<ContactMessageEntity>().ToTable("contact_messages");
        modelBuilder.Entity<AnalyticsEventEntity>().ToTable("analytics_events");
        modelBuilder.Entity<ConsentRecordEntity>().ToTable("consent_records");
        modelBuilder.Entity<AuditLogEntity>().ToTable("audit_logs");

        modelBuilder.Entity<SkillEntity>()
            .HasOne(s => s.SkillGroup)
            .WithMany(g => g.Skills)
            .HasForeignKey(s => s.SkillGroupId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
