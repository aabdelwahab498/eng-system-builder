using System.Net;
using System.Net.Http.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
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
}
