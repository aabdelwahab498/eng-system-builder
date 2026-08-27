using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Infrastructure.Persistence;

namespace Portfolio.Api.Controllers;

[ApiController]
public class HealthController : ControllerBase
{
    private readonly PortfolioDbContext _db;

    public HealthController(PortfolioDbContext db)
    {
        _db = db;
    }

    [HttpGet("/healthz")]
    public IActionResult Healthz()
    {
        return Ok(new { status = "Healthy", service = "Portfolio.Api", version = "1.0.0" });
    }

    [HttpGet("/readyz")]
    public async Task<IActionResult> Readyz()
    {
        try
        {
            var canConnect = await _db.Database.CanConnectAsync();
            if (canConnect)
            {
                return Ok(new { status = "Healthy", database = "Connected" });
            }
            return StatusCode(503, new { status = "Unhealthy", database = "Disconnected" });
        }
        catch
        {
            return StatusCode(503, new { status = "Unhealthy", database = "ConnectionFailed" });
        }
    }
}
