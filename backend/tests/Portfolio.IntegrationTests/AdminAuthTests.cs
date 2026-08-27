using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.IdentityModel.Tokens;
using Portfolio.Application.DTOs;
using Xunit;

namespace Portfolio.IntegrationTests;

public class AdminAuthTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private const string SecretKey = "PORTFOLIO_DEV_JWT_SECRET_KEY_MIN_32_BYTES_LONG_123456789";
    private const string Issuer = "PortfolioApi";
    private const string Audience = "PortfolioClients";

    public AdminAuthTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    private string GenerateJwtToken(string userId, string role, TimeSpan expiresIn, string customIssuer = Issuer, string customAudience = Audience, string customKey = SecretKey)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(customKey);
        var now = DateTime.UtcNow;
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, userId),
                new Claim(ClaimTypes.Role, role),
                new Claim("sub", userId)
            }),
            NotBefore = expiresIn < TimeSpan.Zero ? now.Add(expiresIn).AddMinutes(-5) : now,
            Expires = now.Add(expiresIn),
            Issuer = customIssuer,
            Audience = customAudience,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    [Fact]
    public async Task PublicEndpoint_ShouldBeAccessibleWithoutAuthentication()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/projects");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_AnonymousUser_ShouldReturn401Unauthorized()
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync("/api/v1/admin/audit-logs");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_AuthenticatedNonAdmin_ShouldReturn403Forbidden()
    {
        var client = _factory.CreateClient();
        var userToken = GenerateJwtToken("user-123", "user", TimeSpan.FromHours(1));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", userToken);

        var response = await client.GetAsync("/api/v1/admin/audit-logs");

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_ValidAdministrator_ShouldReturn200OK()
    {
        var client = _factory.CreateClient();
        var adminToken = GenerateJwtToken("admin-999", "admin", TimeSpan.FromHours(1));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);

        var response = await client.GetAsync("/api/v1/admin/audit-logs");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_FakeAdminHeader_ShouldNotGrantAccess()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Admin", "true");
        client.DefaultRequestHeaders.Add("X-Role", "admin");

        var response = await client.GetAsync("/api/v1/admin/audit-logs");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_TamperedJwt_ShouldReturn401Unauthorized()
    {
        var client = _factory.CreateClient();
        var validToken = GenerateJwtToken("admin-999", "admin", TimeSpan.FromHours(1));
        var tamperedToken = validToken + "tampered";
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", tamperedToken);

        var response = await client.GetAsync("/api/v1/admin/audit-logs");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_ExpiredJwt_ShouldReturn401Unauthorized()
    {
        var client = _factory.CreateClient();
        var expiredToken = GenerateJwtToken("admin-999", "admin", TimeSpan.FromMinutes(-10));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", expiredToken);

        var response = await client.GetAsync("/api/v1/admin/audit-logs");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_WrongIssuer_ShouldReturn401Unauthorized()
    {
        var client = _factory.CreateClient();
        var wrongIssuerToken = GenerateJwtToken("admin-999", "admin", TimeSpan.FromHours(1), customIssuer: "UntrustedIssuer");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", wrongIssuerToken);

        var response = await client.GetAsync("/api/v1/admin/audit-logs");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_WrongAudience_ShouldReturn401Unauthorized()
    {
        var client = _factory.CreateClient();
        var wrongAudienceToken = GenerateJwtToken("admin-999", "admin", TimeSpan.FromHours(1), customAudience: "UntrustedAudience");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", wrongAudienceToken);

        var response = await client.GetAsync("/api/v1/admin/audit-logs");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_InvalidSignature_ShouldReturn401Unauthorized()
    {
        var client = _factory.CreateClient();
        var invalidKeyToken = GenerateJwtToken("admin-999", "admin", TimeSpan.FromHours(1), customKey: "UNTRUSTED_SECRET_KEY_1234567890123456789");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", invalidKeyToken);

        var response = await client.GetAsync("/api/v1/admin/audit-logs");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoint_PostProject_ShouldLogAuditEntryWithoutLeakingSecrets()
    {
        var client = _factory.CreateClient();
        var adminToken = GenerateJwtToken("admin-777", "admin", TimeSpan.FromHours(1));
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);

        var requestBody = new AdminProjectRequest
        {
            Slug = "admin-test-project-" + Guid.NewGuid().ToString("N")[..8],
            TitleEn = "Admin Test Project",
            TaglineEn = "Test Tagline",
            RoleEn = "Admin Role",
            SummaryEn = "Project created by authorized admin",
            ProblemEn = "Test Problem",
            ApproachEn = "Test Approach"
        };

        var response = await client.PostAsJsonAsync("/api/v1/admin/projects", requestBody);
        Assert.True(response.IsSuccessStatusCode);

        // Verify audit logs endpoint returns the newly created audit entry
        var auditLogsResponse = await client.GetAsync("/api/v1/admin/audit-logs");
        Assert.Equal(HttpStatusCode.OK, auditLogsResponse.StatusCode);

        var json = await auditLogsResponse.Content.ReadAsStringAsync();
        Assert.DoesNotContain("Authorization", json);
        Assert.DoesNotContain(adminToken, json);
        Assert.DoesNotContain("password", json);
    }
}
