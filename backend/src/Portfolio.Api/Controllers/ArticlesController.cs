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
public class ArticlesController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;

    public ArticlesController(PortfolioDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetArticles()
    {
        var items = await _db.Articles
            .Where(a => a.PublicVisible && a.Status == ContentStatus.Verified)
            .OrderByDescending(a => a.PublishedAt ?? a.CreatedAt)
            .ToListAsync();

        var dtos = items.Select(MapArticle).ToList();
        return OkResponse(dtos);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetArticleBySlug(string slug)
    {
        var item = await _db.Articles.FirstOrDefaultAsync(a => a.Slug == slug && a.PublicVisible && a.Status == ContentStatus.Verified);
        if (item == null)
        {
            return FailResponse("NOT_FOUND", $"Article with slug '{slug}' was not found.", statusCode: 404);
        }

        return OkResponse(MapArticle(item));
    }

    private ArticleDto MapArticle(ArticleEntity a) => new()
    {
        Id = a.Id,
        Slug = a.Slug,
        Title = Locale == "ar" && !string.IsNullOrEmpty(a.TitleAr) ? a.TitleAr : a.TitleEn,
        Summary = Locale == "ar" && !string.IsNullOrEmpty(a.SummaryAr) ? a.SummaryAr : a.SummaryEn,
        Content = Locale == "ar" && !string.IsNullOrEmpty(a.ContentAr) ? a.ContentAr : a.ContentEn,
        CoverImage = a.CoverImage,
        Tags = a.Tags,
        PublishedAt = a.PublishedAt ?? a.CreatedAt,
        CreatedAt = a.CreatedAt
    };
}
