using System;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Portfolio.Infrastructure.Persistence;
using Xunit;

namespace Portfolio.IntegrationTests;

public class ApiIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ApiIntegrationTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task Healthz_ShouldReturn200OK()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/healthz");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Readyz_ShouldReturn200OK()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/readyz");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task GetProjects_ShouldReturn200OKWithJsonData()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/projects");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task CanonicalDataImporter_ShouldBeIdempotent()
    {
        var options = new DbContextOptionsBuilder<PortfolioDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        using var db = new PortfolioDbContext(options);

        // Run 1: Initial insertion
        var run1 = await CanonicalDataImporter.ImportCanonicalDataAsync(db);
        Assert.True(run1.InsertedCount > 0);

        // Run 2: Second run should insert 0 new records
        var run2 = await CanonicalDataImporter.ImportCanonicalDataAsync(db);
        Assert.Equal(0, run2.InsertedCount);

        // Run 3: Third run should insert 0 new records
        var run3 = await CanonicalDataImporter.ImportCanonicalDataAsync(db);
        Assert.Equal(0, run3.InsertedCount);
    }

    [Fact]
    public async Task CanonicalDataImporter_ShouldHaveDataParityWithCanonicalSource()
    {
        var options = new DbContextOptionsBuilder<PortfolioDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        using var db = new PortfolioDbContext(options);
        await CanonicalDataImporter.ImportCanonicalDataAsync(db);

        Assert.Equal(13, await db.Projects.CountAsync());
        Assert.Equal(4, await db.Experiences.CountAsync());
        Assert.Equal(4, await db.Educations.CountAsync());
        Assert.True(await db.SkillGroups.CountAsync() >= 2);
        Assert.Equal(2, await db.Products.CountAsync());
        Assert.True(await db.Services.CountAsync() >= 2);
        Assert.Equal(5, await db.Courses.CountAsync());
    }
}
