using System;
using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

namespace Portfolio.ContractTests;

public class AnnouncementsContractTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;

    public AnnouncementsContractTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    [Fact]
    public async Task GetAnnouncements_Returns200AndEnvelope()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/announcements");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var json = await response.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        var root = doc.RootElement;

        Assert.True(root.GetProperty("success").GetBoolean());
        Assert.True(root.TryGetProperty("data", out _));
    }

    [Fact]
    public async Task AdminAnnouncements_WithoutToken_Returns401()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/admin/announcements");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AdminAnnouncements_FullCrudAndActiveFilter_Succeeds()
    {
        var client = _factory.CreateClient();
        var token = await GetAdminTokenAsync(client);
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // 1. Create Active Announcement
        var activePayload = new
        {
            titleEn = "System Maintenance Scheduled",
            messageEn = "We will perform maintenance tonight at 2 AM UTC.",
            kind = "warning",
            priority = 10,
            status = 0, // Verified
            publicVisible = true,
            startsAt = DateTimeOffset.UtcNow.AddMinutes(-5),
            endsAt = DateTimeOffset.UtcNow.AddHours(2)
        };

        var createActiveResp = await client.PostAsJsonAsync("/api/v1/admin/announcements", activePayload);
        Assert.Equal(HttpStatusCode.Created, createActiveResp.StatusCode);

        var activeJson = await createActiveResp.Content.ReadAsStringAsync();
        using var activeDoc = JsonDocument.Parse(activeJson);
        var activeId = activeDoc.RootElement.GetProperty("data").GetProperty("id").GetString();
        Assert.NotNull(activeId);

        // 2. Create Expired Announcement
        var expiredPayload = new
        {
            titleEn = "Past Sale",
            messageEn = "Discount ended yesterday.",
            kind = "info",
            priority = 1,
            status = 0,
            publicVisible = true,
            startsAt = DateTimeOffset.UtcNow.AddDays(-2),
            endsAt = DateTimeOffset.UtcNow.AddDays(-1)
        };
        var createExpiredResp = await client.PostAsJsonAsync("/api/v1/admin/announcements", expiredPayload);
        Assert.Equal(HttpStatusCode.Created, createExpiredResp.StatusCode);

        // 3. Verify Public GET only includes Active Announcement
        var publicResp = await client.GetAsync("/api/v1/announcements");
        Assert.Equal(HttpStatusCode.OK, publicResp.StatusCode);
        var publicJson = await publicResp.Content.ReadAsStringAsync();
        using var publicDoc = JsonDocument.Parse(publicJson);
        var dataArray = publicDoc.RootElement.GetProperty("data");
        Assert.True(dataArray.GetArrayLength() >= 1);

        // 4. Update Announcement
        var updatePayload = new
        {
            titleEn = "System Maintenance Rescheduled",
            messageEn = "We will perform maintenance tomorrow.",
            kind = "info",
            priority = 5,
            status = 0,
            publicVisible = true,
            startsAt = DateTimeOffset.UtcNow.AddMinutes(-5),
            endsAt = DateTimeOffset.UtcNow.AddHours(24)
        };
        var updateResp = await client.PutAsJsonAsync($"/api/v1/admin/announcements/{activeId}", updatePayload);
        Assert.Equal(HttpStatusCode.OK, updateResp.StatusCode);

        // 5. Delete Announcement
        var deleteResp = await client.DeleteAsync($"/api/v1/admin/announcements/{activeId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResp.StatusCode);
    }

    private static async Task<string> GetAdminTokenAsync(System.Net.Http.HttpClient client)
    {
        var loginResponse = await client.PostAsJsonAsync("/api/v1/auth/login", new { email = "admin@nextnext-gen.com", password = "AdminPassword123!" });
        var json = await loginResponse.Content.ReadAsStringAsync();
        using var doc = JsonDocument.Parse(json);
        return doc.RootElement.GetProperty("data").GetProperty("token").GetString()!;
    }
}
