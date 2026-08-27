using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Portfolio.ContractTests;

public class ContractTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ContractTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Theory]
    [InlineData("/api/v1/profile")]
    [InlineData("/api/v1/projects")]
    [InlineData("/api/v1/projects/featured")]
    [InlineData("/api/v1/experience")]
    [InlineData("/api/v1/education")]
    [InlineData("/api/v1/certifications")]
    [InlineData("/api/v1/skills")]
    [InlineData("/api/v1/services")]
    [InlineData("/api/v1/products")]
    [InlineData("/api/v1/courses")]
    public async Task Endpoints_ShouldConformToApiContractV1Envelope(string endpoint)
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync(endpoint);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        Assert.True(root.GetProperty("success").GetBoolean(), $"Endpoint {endpoint} failed success check");
        Assert.True(root.TryGetProperty("data", out _), $"Endpoint {endpoint} missing data property");
        Assert.True(root.TryGetProperty("meta", out var meta), $"Endpoint {endpoint} missing meta property");
        Assert.True(meta.TryGetProperty("timestamp", out _), $"Endpoint {endpoint} missing timestamp property");
    }

    [Fact]
    public async Task GetProjectBySlug_ShouldReturn200ForValidSlug()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/projects/nextnext-gen-hub");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }
}
