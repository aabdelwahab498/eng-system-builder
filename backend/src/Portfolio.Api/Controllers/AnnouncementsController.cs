using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Portfolio.Application.DTOs;
using Portfolio.Domain;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Persistence;

namespace Portfolio.Api.Controllers;

[Route("api/v1/[controller]")]
public class AnnouncementsController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;

    public AnnouncementsController(PortfolioDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAnnouncements()
    {
        var now = DateTimeOffset.UtcNow;
        var items = await _db.Announcements
            .Where(a => a.PublicVisible &&
                        a.Status == ContentStatus.Verified &&
                        a.StartsAt <= now &&
                        (a.EndsAt == null || a.EndsAt >= now))
            .OrderByDescending(a => a.Priority)
            .ThenByDescending(a => a.CreatedAt)
            .ToListAsync();

        var dtos = items.Select(MapAnnouncement).ToList();
        return OkResponse(dtos);
    }

    private AnnouncementDto MapAnnouncement(AnnouncementEntity a) => new()
    {
        Id = a.Id,
        Title = Locale == "ar" && !string.IsNullOrEmpty(a.TitleAr) ? a.TitleAr : a.TitleEn,
        Message = Locale == "ar" && !string.IsNullOrEmpty(a.MessageAr) ? a.MessageAr : a.MessageEn,
        LinkUrl = a.LinkUrl,
        LinkText = Locale == "ar" && !string.IsNullOrEmpty(a.LinkTextAr) ? a.LinkTextAr : a.LinkTextEn,
        Kind = a.Kind,
        Priority = a.Priority,
        StartsAt = a.StartsAt,
        EndsAt = a.EndsAt
    };
}
