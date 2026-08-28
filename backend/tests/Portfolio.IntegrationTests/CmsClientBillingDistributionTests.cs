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
using Microsoft.IdentityModel.Tokens;
using Portfolio.Application.DTOs;
using Xunit;

namespace Portfolio.IntegrationTests;

public class CmsClientBillingDistributionTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private const string SecretKey = "PORTFOLIO_DEV_JWT_SECRET_KEY_MIN_32_BYTES_LONG_123456789";
    private const string Issuer = "PortfolioApi";
    private const string Audience = "PortfolioClients";

    public CmsClientBillingDistributionTests(WebApplicationFactory<Program> factory)
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
        var res1 = await client.GetAsync("/api/v1/admin/clients");
        Assert.Equal(HttpStatusCode.Unauthorized, res1.StatusCode);

        var res2 = await client.GetAsync("/api/v1/admin/invoices");
        Assert.Equal(HttpStatusCode.Unauthorized, res2.StatusCode);

        var res3 = await client.GetAsync("/api/v1/admin/distribution");
        Assert.Equal(HttpStatusCode.Unauthorized, res3.StatusCode);
    }

    [Fact]
    public async Task NonAdminUser_Returns403Forbidden()
    {
        var client = _factory.CreateClient();
        var token = GenerateJwtToken("user-456", "User");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/v1/admin/clients");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AdminCanCreateListUpdateAndDeleteClient_FullLifecycle()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // 1. Create client
        var createRes = await adminClient.PostAsJsonAsync("/api/v1/admin/clients", new
        {
            name = "Acme Corp",
            email = "contact@acme.com",
            whatsapp = "+1234567890",
            country = "US",
            service = "Full-Stack Development",
            status = "active_project",
            plan = "monthly",
            amount = "5000",
            currency = "USD"
        });

        Assert.Equal(HttpStatusCode.Created, createRes.StatusCode);
        var createEnvelope = await createRes.Content.ReadFromJsonAsync<ApiResponse<AdminClientDto>>();
        Assert.NotNull(createEnvelope?.Data);
        var clientId = createEnvelope.Data.Id;
        Assert.Equal("Acme Corp", createEnvelope.Data.Name);
        Assert.Equal("active_project", createEnvelope.Data.Status);

        // 2. List clients and verify existence
        var listRes = await adminClient.GetAsync("/api/v1/admin/clients");
        Assert.Equal(HttpStatusCode.OK, listRes.StatusCode);
        var listEnvelope = await listRes.Content.ReadFromJsonAsync<ApiResponse<List<AdminClientDto>>>();
        Assert.NotNull(listEnvelope?.Data);
        var item = listEnvelope.Data.FirstOrDefault(c => c.Id == clientId);
        Assert.NotNull(item);

        // 3. Update client
        var updateRes = await adminClient.PutAsJsonAsync($"/api/v1/admin/clients/{clientId}", new
        {
            name = "Acme Global Corp",
            status = "completed"
        });
        Assert.Equal(HttpStatusCode.OK, updateRes.StatusCode);
        var updateEnvelope = await updateRes.Content.ReadFromJsonAsync<ApiResponse<AdminClientDto>>();
        Assert.Equal("Acme Global Corp", updateEnvelope?.Data?.Name);
        Assert.Equal("completed", updateEnvelope?.Data?.Status);

        // 4. Delete client
        var deleteRes = await adminClient.DeleteAsync($"/api/v1/admin/clients/{clientId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteRes.StatusCode);

        // 5. Verify deleted
        var getRes = await adminClient.GetAsync($"/api/v1/admin/clients/{clientId}");
        Assert.Equal(HttpStatusCode.NotFound, getRes.StatusCode);
    }

    [Fact]
    public async Task AdminCanCreateListUpdateStatusAndDeleteInvoice_FullLifecycle()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // 1. Create invoice
        var createRes = await adminClient.PostAsJsonAsync("/api/v1/admin/invoices", new
        {
            clientId = "client-777",
            amount = "1500",
            currency = "EGP",
            method = "InstaPay",
            status = "pending",
            invoiceRef = "INV-2026-001",
            note = "Initial deposit",
            paidAt = "2026-08-28"
        });

        Assert.Equal(HttpStatusCode.Created, createRes.StatusCode);
        var createEnvelope = await createRes.Content.ReadFromJsonAsync<ApiResponse<AdminInvoiceDto>>();
        Assert.NotNull(createEnvelope?.Data);
        var invoiceId = createEnvelope.Data.Id;
        Assert.Equal("INV-2026-001", createEnvelope.Data.InvoiceRef);
        Assert.Equal("pending", createEnvelope.Data.Status);

        // 2. List invoices
        var listRes = await adminClient.GetAsync("/api/v1/admin/invoices");
        Assert.Equal(HttpStatusCode.OK, listRes.StatusCode);

        // 3. Update status to paid
        var patchRes = await adminClient.PatchAsJsonAsync($"/api/v1/admin/invoices/{invoiceId}/status", new
        {
            status = "paid"
        });
        Assert.Equal(HttpStatusCode.OK, patchRes.StatusCode);
        var patchEnvelope = await patchRes.Content.ReadFromJsonAsync<ApiResponse<AdminInvoiceDto>>();
        Assert.Equal("paid", patchEnvelope?.Data?.Status);

        // 4. Delete invoice
        var deleteRes = await adminClient.DeleteAsync($"/api/v1/admin/invoices/{invoiceId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteRes.StatusCode);
    }

    [Fact]
    public async Task AdminCanReadAndUpdateDistributionConfig()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Read distribution config
        var getRes = await adminClient.GetAsync("/api/v1/admin/distribution");
        Assert.Equal(HttpStatusCode.OK, getRes.StatusCode);
        var getEnvelope = await getRes.Content.ReadFromJsonAsync<ApiResponse<AdminDistributionConfigDto>>();
        Assert.NotNull(getEnvelope?.Data);

        // Update distribution config
        var updateRes = await adminClient.PutAsJsonAsync("/api/v1/admin/distribution", new
        {
            pixelConfigsJson = "[{\"channelId\":\"meta\",\"pixelId\":\"123456789\"}]",
            adCampaignsJson = "[]"
        });

        Assert.Equal(HttpStatusCode.OK, updateRes.StatusCode);
        var updateEnvelope = await updateRes.Content.ReadFromJsonAsync<ApiResponse<AdminDistributionConfigDto>>();
        Assert.Contains("meta", updateEnvelope?.Data?.PixelConfigsJson ?? "");
    }

    [Fact]
    public async Task InvalidClientPayload_Returns400ValidationError()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Empty required name
        var response = await adminClient.PostAsJsonAsync("/api/v1/admin/clients", new
        {
            name = "",
            status = "invalid_status_value"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task InvalidInvoiceStatus_Returns400ValidationError()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var randomId = Guid.NewGuid();
        var response = await adminClient.PatchAsJsonAsync($"/api/v1/admin/invoices/{randomId}/status", new
        {
            status = "unknown_status"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task ClientNotFound_Returns404()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var randomId = Guid.NewGuid();
        var response = await adminClient.GetAsync($"/api/v1/admin/clients/{randomId}");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task InvoiceNotFound_Returns404()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var randomId = Guid.NewGuid();
        var response = await adminClient.GetAsync($"/api/v1/admin/invoices/{randomId}");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
