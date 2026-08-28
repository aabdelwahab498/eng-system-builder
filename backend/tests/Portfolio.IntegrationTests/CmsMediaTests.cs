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
using Portfolio.Infrastructure.Persistence;
using Xunit;

namespace Portfolio.IntegrationTests;

public class CmsMediaTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private const string SecretKey = "PORTFOLIO_DEV_JWT_SECRET_KEY_MIN_32_BYTES_LONG_123456789";
    private const string Issuer = "PortfolioApi";
    private const string Audience = "PortfolioClients";

    public CmsMediaTests(WebApplicationFactory<Program> factory)
    {
        _factory = factory;
    }

    private static string GenerateJwtToken(string userId, string role)
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
        var response = await client.GetAsync("/api/v1/admin/media");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task NonAdminUser_Returns403Forbidden()
    {
        var client = _factory.CreateClient();
        var token = GenerateJwtToken("user-123", "User");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/v1/admin/media");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AdminCanListRegisterUpdateAndDeleteMediaAsset_FullLifecycle()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // 1. Register media asset
        var registerRes = await adminClient.PostAsJsonAsync("/api/v1/admin/media", new
        {
            filename = "hero_banner.webp",
            storagePath = "media/hero_banner.webp",
            mimeType = "image/webp",
            sizeBytes = 204800,
            altEn = "Hero Banner Image",
            altAr = "صورة الشعار الرئيسي"
        });

        Assert.Equal(HttpStatusCode.Created, registerRes.StatusCode);
        var registerEnvelope = await registerRes.Content.ReadFromJsonAsync<ApiResponse<AdminMediaAssetDto>>();
        Assert.NotNull(registerEnvelope?.Data);
        var assetId = registerEnvelope.Data.Id;
        Assert.Equal("hero_banner.webp", registerEnvelope.Data.Filename);
        Assert.Equal("/api/public/media/media/hero_banner.webp", registerEnvelope.Data.PublicUrl);

        // 2. List media assets and verify asset exists
        var listRes = await adminClient.GetAsync("/api/v1/admin/media?search=hero");
        Assert.Equal(HttpStatusCode.OK, listRes.StatusCode);
        var listEnvelope = await listRes.Content.ReadFromJsonAsync<ApiResponse<List<AdminMediaAssetDto>>>();
        Assert.NotNull(listEnvelope?.Data);
        var asset = listEnvelope.Data.FirstOrDefault(m => m.Id == assetId);
        Assert.NotNull(asset);
        Assert.Equal("Hero Banner Image", asset.AltEn);

        // 3. Update media asset
        var updateRes = await adminClient.PutAsJsonAsync($"/api/v1/admin/media/{assetId}", new
        {
            altEn = "Updated Hero Banner Alt Text",
            altAr = "نص تعريفي مخصص للشعار",
            captionEn = "Main homepage hero image",
            archived = false
        });
        Assert.Equal(HttpStatusCode.OK, updateRes.StatusCode);

        // 4. Delete media asset
        var deleteRes = await adminClient.DeleteAsync($"/api/v1/admin/media/{assetId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteRes.StatusCode);

        // 5. Verify deleted
        var getRes = await adminClient.GetAsync($"/api/v1/admin/media/{assetId}");
        Assert.Equal(HttpStatusCode.NotFound, getRes.StatusCode);
    }

    [Fact]
    public async Task InvalidMediaPayload_Returns400ValidationError()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Missing required filename & storagePath
        var response = await adminClient.PostAsJsonAsync("/api/v1/admin/media", new
        {
            filename = "",
            storagePath = ""
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task NotFoundBehavior_Returns404ForNonExistentAsset()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var randomId = Guid.NewGuid();
        var response = await adminClient.GetAsync($"/api/v1/admin/media/{randomId}");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
