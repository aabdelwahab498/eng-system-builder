using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Persistence;

namespace Portfolio.Api.Controllers;

[Route("api/v1/admin")]
[ApiController]
[Authorize(Policy = "Administrator")]
public class AdminController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;

    public AdminController(PortfolioDbContext db)
    {
        _db = db;
    }

    [HttpGet("audit-logs")]
    public async Task<IActionResult> GetAuditLogs()
    {
        var logs = await _db.AuditLogs.AsNoTracking().ToListAsync();
        return OkResponse(logs);
    }

    [HttpPost("projects")]
    public async Task<IActionResult> CreateProject([FromBody] CreateAdminProjectRequest request)
    {
        if (request == null || string.IsNullOrWhiteSpace(request.Slug) || string.IsNullOrWhiteSpace(request.TitleEn))
        {
            return BadRequest("Slug and TitleEn are required.");
        }

        var actorId = User.FindFirstValue(ClaimTypes.NameIdentifier) 
                      ?? User.FindFirstValue("sub") 
                      ?? "unknown-admin";

        var project = new ProjectEntity
        {
            Slug = request.Slug,
            TitleEn = request.TitleEn,
            TaglineEn = request.TitleEn,
            RoleEn = "Administrator",
            SummaryEn = request.SummaryEn ?? string.Empty,
            ProblemEn = "Admin created project",
            ApproachEn = "Direct admin entry",
            PublicVisible = request.PublicVisible
        };

        _db.Projects.Add(project);

        var auditLog = new AuditLogEntity
        {
            User = actorId,
            Action = "CREATE_PROJECT",
            EntityName = nameof(ProjectEntity),
            EntityId = project.Id.ToString(),
            CorrelationId = HttpContext.TraceIdentifier,
            IpAddress = HttpContext.Connection.RemoteIpAddress?.ToString(),
            UserAgent = Request.Headers["User-Agent"].ToString(),
            Success = true,
            MetadataJson = $"{{\"slug\":\"{request.Slug}\"}}"
        };

        _db.AuditLogs.Add(auditLog);
        await _db.SaveChangesAsync();

        return OkResponse(project);
    }
}

public class CreateAdminProjectRequest
{
    public required string Slug { get; set; }
    public required string TitleEn { get; set; }
    public string? SummaryEn { get; set; }
    public bool PublicVisible { get; set; } = true;
}
