using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Portfolio.ContractTests;

public class MediaContractTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public MediaContractTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetMediaFile_WhenMissing_Returns404()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/media/file/non-existent-image-file.png");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task UploadMedia_WithoutToken_Returns401()
    {
        var client = _factory.CreateClient();
        using var content = new MultipartFormDataContent();
        content.Add(new ByteArrayContent(Encoding.UTF8.GetBytes("dummy content")), "File", "sample.txt");

        var response = await client.PostAsync("/api/v1/admin/media/upload", content);
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task UploadMediaAndRetrieveStream_FullFlow_SucceedsForAdmin()
    {
        var client = _factory.CreateClient();
        var token = await GetAdminTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // 1. Upload sample text file binary
        var fileBytes = Encoding.UTF8.GetBytes("Hello World Binary Media Content!");
        using var form = new MultipartFormDataContent();
        var fileContent = new ByteArrayContent(fileBytes);
        fileContent.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
        form.Add(fileContent, "File", "test-binary.txt");
        form.Add(new StringContent("Test Alt English"), "AltEn");

        var uploadResponse = await client.PostAsync("/api/v1/admin/media/upload", form);
        Assert.Equal(HttpStatusCode.Created, uploadResponse.StatusCode);

        var uploadJson = await uploadResponse.Content.ReadAsStringAsync();
        using var uploadDoc = JsonDocument.Parse(uploadJson);
        var data = uploadDoc.RootElement.GetProperty("data");
        var publicUrl = data.GetProperty("publicUrl").GetString();
        var storagePath = data.GetProperty("storagePath").GetString();

        Assert.NotNull(publicUrl);
        Assert.NotNull(storagePath);

        // 2. Stream binary file publicly using returned PublicUrl
        var streamClient = _factory.CreateClient();
        var streamResponse = await streamClient.GetAsync(publicUrl);
        Assert.Equal(HttpStatusCode.OK, streamResponse.StatusCode);

        var streamedBytes = await streamResponse.Content.ReadAsByteArrayAsync();
        Assert.Equal(fileBytes, streamedBytes);
    }

    private static async Task<string> GetAdminTokenAsync(HttpClient client)
    {
        var loginResponse = await client.PostAsJsonAsync("/api/v1/auth/login", new { email = "admin@nextnext-gen.com", password = "AdminPassword123!" });
        var json = await loginResponse.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        return doc.RootElement.GetProperty("data").GetProperty("token").GetString()!;
    }
}
