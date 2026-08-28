using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Portfolio.Application.DTOs;
using Portfolio.Domain.Entities;
using Portfolio.Api.Controllers;
using Portfolio.Infrastructure.Persistence;
using Xunit;

namespace Portfolio.IntegrationTests;

public class CmsRequestsTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private const string SecretKey = "PORTFOLIO_DEV_JWT_SECRET_KEY_MIN_32_BYTES_LONG_123456789";
    private const string Issuer = "PortfolioApi";
    private const string Audience = "PortfolioClients";

    public CmsRequestsTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    private string GenerateJwtToken(string userId, string role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(SecretKey);
        var now = DateTime.UtcNow;
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, role),
                new Claim("sub", userId)
            }),
            NotBefore = now,
            Expires = now.AddHours(1),
            Issuer = Issuer,
            Audience = Audience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    [Fact]
    public async Task AnonymousRequest_Returns401Unauthorized()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/admin/requests");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task NonAdminUser_Returns403Forbidden()
    {
        var client = _factory.CreateClient();
        var token = GenerateJwtToken("user-123", "User");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/v1/admin/requests");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AdminCanListAndManageRequests_FullLifecycle()
    {
        var client = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // 1. Submit a public contact message
        var publicClient = _factory.CreateClient();
        var submitRes = await publicClient.PostAsJsonAsync("/api/v1/contact", new
        {
            name = "Sarah Miller",
            email = "sarah@example.com",
            subject = "Custom Cloud Systems Architecture",
            message = "We need assistance migrating our infrastructure to cloud native services."
        });

        Assert.Equal(HttpStatusCode.OK, submitRes.StatusCode);

        // 2. Admin lists requests
        var listRes = await client.GetAsync("/api/v1/admin/requests");
        Assert.Equal(HttpStatusCode.OK, listRes.StatusCode);
        var envelope = await listRes.Content.ReadFromJsonAsync<ApiResponse<List<AdminContactMessageDto>>>();
        Assert.NotNull(envelope);
        Assert.True(envelope.Success);
        Assert.NotNull(envelope.Data);

        var created = envelope.Data.FirstOrDefault(x => x.Email == "sarah@example.com");
        Assert.NotNull(created);
        Assert.Equal("new", created.StatusState);

        // 3. Admin fetches request detail by ID
        var detailRes = await client.GetAsync($"/api/v1/admin/requests/{created.Id}");
        Assert.Equal(HttpStatusCode.OK, detailRes.StatusCode);
        var detailEnv = await detailRes.Content.ReadFromJsonAsync<ApiResponse<AdminContactMessageDto>>();
        Assert.NotNull(detailEnv?.Data);
        Assert.Equal("Sarah Miller", detailEnv.Data.Name);

        // 4. Admin updates status to "contacted"
        var statusPatchRes = await client.PatchAsJsonAsync($"/api/v1/admin/requests/{created.Id}/status", new
        {
            statusState = "contacted"
        });
        Assert.Equal(HttpStatusCode.OK, statusPatchRes.StatusCode);
        var statusEnv = await statusPatchRes.Content.ReadFromJsonAsync<ApiResponse<AdminContactMessageDto>>();
        Assert.NotNull(statusEnv?.Data);
        Assert.Equal("contacted", statusEnv.Data.StatusState);

        // 5. Admin updates note
        var noteRes = await client.PostAsJsonAsync($"/api/v1/admin/requests/{created.Id}/notes", new
        {
            adminNote = "Sent proposal email and scheduled discovery call for next Tuesday."
        });
        Assert.Equal(HttpStatusCode.OK, noteRes.StatusCode);
        var noteEnv = await noteRes.Content.ReadFromJsonAsync<ApiResponse<AdminContactMessageDto>>();
        Assert.NotNull(noteEnv?.Data);
        Assert.Equal("Sent proposal email and scheduled discovery call for next Tuesday.", noteEnv.Data.AdminNote);

        // 6. Verify audit logs for status and note updates
        var auditRes = await client.GetAsync("/api/v1/admin/audit-logs");
        Assert.Equal(HttpStatusCode.OK, auditRes.StatusCode);
        var auditEnv = await auditRes.Content.ReadFromJsonAsync<ApiResponse<List<AuditLogEntity>>>();
        Assert.NotNull(auditEnv?.Data);
        Assert.Contains(auditEnv.Data, a => a.Action == "UpdateContactRequestStatus" && a.EntityId == created.Id.ToString());
        Assert.Contains(auditEnv.Data, a => a.Action == "UpdateContactRequestNote" && a.EntityId == created.Id.ToString());

        // 7. Admin deletes request
        var deleteRes = await client.DeleteAsync($"/api/v1/admin/requests/{created.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteRes.StatusCode);

        // 8. Verify deletion
        var getDeleted = await client.GetAsync($"/api/v1/admin/requests/{created.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getDeleted.StatusCode);
    }

    [Fact]
    public async Task InvalidStatus_Returns400ValidationError()
    {
        var client = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Submit a request first
        var publicClient = _factory.CreateClient();
        var submitRes = await publicClient.PostAsJsonAsync("/api/v1/contact", new
        {
            name = "Validation Test User",
            email = "val@example.com",
            subject = "Testing invalid status",
            message = "Test message body"
        });
        Assert.Equal(HttpStatusCode.OK, submitRes.StatusCode);

        var listRes = await client.GetAsync("/api/v1/admin/requests");
        var envelope = await listRes.Content.ReadFromJsonAsync<ApiResponse<List<AdminContactMessageDto>>>();
        var item = envelope!.Data!.First(x => x.Email == "val@example.com");

        // Attempt invalid status
        var statusPatchRes = await client.PatchAsJsonAsync($"/api/v1/admin/requests/{item.Id}/status", new
        {
            statusState = "invalid_custom_status_value"
        });
        Assert.Equal(HttpStatusCode.BadRequest, statusPatchRes.StatusCode);
    }

    [Fact]
    public async Task ReceivedToNewStatusBackfill_ExecutesSuccessfully()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();

        var legacyMsg = new ContactMessageEntity
        {
            Name = "Legacy User",
            Email = "legacy@example.com",
            Subject = "Old Message",
            Message = "Submitted before migration",
            StatusState = "Received"
        };
        db.ContactMessages.Add(legacyMsg);
        await db.SaveChangesAsync();

        // Run canonical data importer (which triggers backfill)
        await CanonicalDataImporter.ImportCanonicalDataAsync(db);

        var updatedMsg = await db.ContactMessages.FindAsync(legacyMsg.Id);
        Assert.NotNull(updatedMsg);
        Assert.Equal("new", updatedMsg.StatusState);
    }

    [Fact]
    public async Task NotFoundBehavior_Returns404ForNonExistentRequest()
    {
        var client = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var nonExistentId = Guid.NewGuid();

        var getRes = await client.GetAsync($"/api/v1/admin/requests/{nonExistentId}");
        Assert.Equal(HttpStatusCode.NotFound, getRes.StatusCode);

        var patchRes = await client.PatchAsJsonAsync($"/api/v1/admin/requests/{nonExistentId}/status", new { statusState = "contacted" });
        Assert.Equal(HttpStatusCode.NotFound, patchRes.StatusCode);

        var postRes = await client.PostAsJsonAsync($"/api/v1/admin/requests/{nonExistentId}/notes", new { adminNote = "Test note" });
        Assert.Equal(HttpStatusCode.NotFound, postRes.StatusCode);

        var delRes = await client.DeleteAsync($"/api/v1/admin/requests/{nonExistentId}");
        Assert.Equal(HttpStatusCode.NotFound, delRes.StatusCode);
    }

    [Fact]
    public async Task NoteValidation_TooLongNote_Returns400ValidationError()
    {
        var client = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var publicClient = _factory.CreateClient();
        var submitRes = await publicClient.PostAsJsonAsync("/api/v1/contact", new
        {
            name = "Note Val User",
            email = "noteval@example.com",
            subject = "Testing note validation",
            message = "Test message body"
        });
        Assert.Equal(HttpStatusCode.OK, submitRes.StatusCode);

        var listRes = await client.GetAsync("/api/v1/admin/requests");
        var envelope = await listRes.Content.ReadFromJsonAsync<ApiResponse<List<AdminContactMessageDto>>>();
        var item = envelope!.Data!.First(x => x.Email == "noteval@example.com");

        var longNote = new string('a', 4001);
        var noteRes = await client.PostAsJsonAsync($"/api/v1/admin/requests/{item.Id}/notes", new
        {
            adminNote = longNote
        });
        Assert.Equal(HttpStatusCode.BadRequest, noteRes.StatusCode);
    }
}
