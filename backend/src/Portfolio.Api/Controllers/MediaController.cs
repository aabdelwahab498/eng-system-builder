using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using Portfolio.Infrastructure.Persistence;

namespace Portfolio.Api.Controllers;

[Route("api/v1/[controller]")]
public class MediaController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;

    public MediaController(PortfolioDbContext db)
    {
        _db = db;
    }

    [HttpGet("file/{*storagePath}")]
    public async Task<IActionResult> GetMediaFile(string storagePath)
    {
        if (string.IsNullOrWhiteSpace(storagePath))
        {
            return NotFound();
        }

        var fileName = Path.GetFileName(storagePath);
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", fileName);

        if (!System.IO.File.Exists(filePath))
        {
            return FailResponse("FILE_NOT_FOUND", $"Media file '{storagePath}' was not found.", statusCode: 404);
        }

        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(filePath, out var contentType))
        {
            contentType = "application/octet-stream";
        }

        var bytes = await System.IO.File.ReadAllBytesAsync(filePath);
        return File(bytes, contentType, fileName);
    }
}
