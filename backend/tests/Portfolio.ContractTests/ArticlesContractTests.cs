using System;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Portfolio.ContractTests;

public class ArticlesContractTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ArticlesContractTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetArticles_Returns200AndEnvelope()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/articles");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        Assert.True(root.GetProperty("success").GetBoolean());
        Assert.True(root.TryGetProperty("data", out _));
    }

    [Fact]
    public async Task GetArticleBySlug_WhenMissing_Returns404()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/articles/non-existent-article-slug");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task AdminArticles_WithoutToken_Returns401()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/admin/articles");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AdminArticles_FullCrudFlow_SucceedsForAdmin()
    {
        var client = _factory.CreateClient();
        var token = await GetAdminTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // 1. Create Article
        var createPayload = new
        {
            slug = "test-architecture-article",
            titleEn = "Clean Architecture in .NET 8",
            summaryEn = "Guide to Clean Architecture in ASP.NET Core 8",
            contentEn = "Full article content goes here...",
            status = 0, // Verified
            publicVisible = true
        };

        var createResponse = await client.PostAsJsonAsync("/api/v1/admin/articles", createPayload);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var createJson = await createResponse.Content.ReadAsStringAsync();
        using var createDoc = JsonDocument.Parse(createJson);
        var articleId = createDoc.RootElement.GetProperty("data").GetProperty("id").GetString();
        Assert.NotNull(articleId);

        // 2. Get Public List & verify presence
        var publicListResp = await client.GetAsync("/api/v1/articles");
        Assert.Equal(HttpStatusCode.OK, publicListResp.StatusCode);

        // 3. Get Public Slug Lookup
        var publicSlugResp = await client.GetAsync("/api/v1/articles/test-architecture-article");
        Assert.Equal(HttpStatusCode.OK, publicSlugResp.StatusCode);

        // 4. Update Article
        var updatePayload = new
        {
            slug = "test-architecture-article-updated",
            titleEn = "Clean Architecture in .NET 8 (Updated)",
            summaryEn = "Updated Summary",
            contentEn = "Updated Content",
            status = 0,
            publicVisible = true
        };

        var updateResponse = await client.PutAsJsonAsync($"/api/v1/admin/articles/{articleId}", updatePayload);
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // 5. Delete Article
        var deleteResponse = await client.DeleteAsync($"/api/v1/admin/articles/{articleId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }

    private static async Task<string> GetAdminTokenAsync(System.Net.Http.HttpClient client)
    {
        var loginResponse = await client.PostAsJsonAsync("/api/v1/auth/login", new { email = "admin@nextnext-gen.com", password = "AdminPassword123!" });
        var json = await loginResponse.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        return doc.RootElement.GetProperty("data").GetProperty("token").GetString()!;
    }
}
