using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Portfolio.ContractTests;

public class ContactContractTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ContactContractTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task SubmitContact_StandardPayload_Returns200OKAndEnvelope()
    {
        var client = _factory.CreateClient();
        var payload = new
        {
            name = "Jane Doe",
            email = "jane.doe@example.com",
            subject = "Project Architecture Consultation",
            message = "We would like to hire you for a custom system architecture."
        };

        var response = await client.PostAsJsonAsync("/api/v1/contact", payload);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        Assert.True(root.GetProperty("success").GetBoolean());
        Assert.True(root.GetProperty("data").GetProperty("received").GetBoolean());
    }

    [Fact]
    public async Task SubmitContact_WithFullNameAliasAndNoSubject_Returns200OK()
    {
        var client = _factory.CreateClient();
        var payload = new
        {
            full_name = "John Smith",
            email = "john.smith@example.com",
            service = "Lead Backend Contract",
            message = "Interested in lead backend contract terms."
        };

        var response = await client.PostAsJsonAsync("/api/v1/contact", payload);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        Assert.True(doc.RootElement.GetProperty("success").GetBoolean());
    }

    [Fact]
    public async Task SubmitContact_InvalidEmail_Returns400BadRequest()
    {
        var client = _factory.CreateClient();
        var payload = new
        {
            name = "Bad User",
            email = "not-an-email",
            subject = "Hello",
            message = "Sample text message."
        };

        var response = await client.PostAsJsonAsync("/api/v1/contact", payload);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        Assert.False(doc.RootElement.GetProperty("success").GetBoolean());
    }
}
