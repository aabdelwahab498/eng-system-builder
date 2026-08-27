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

    [Fact]
    public async Task ProfileEndpoint_ShouldConformToApiContractV1Schema()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/profile");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        Assert.True(root.GetProperty("success").GetBoolean());
        Assert.True(root.TryGetProperty("data", out _));
        Assert.True(root.TryGetProperty("meta", out var meta));
        Assert.True(meta.TryGetProperty("timestamp", out _));
    }
}
