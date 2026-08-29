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

public class CmsPaymentTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private const string SecretKey = "PORTFOLIO_DEV_JWT_SECRET_KEY_MIN_32_BYTES_LONG_123456789";
    private const string Issuer = "PortfolioApi";
    private const string Audience = "PortfolioClients";

    public CmsPaymentTests(WebApplicationFactory<Program> factory)
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
        var response = await client.GetAsync("/api/v1/admin/payments");
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Fact]
    public async Task NonAdminUser_Returns403Forbidden()
    {
        var client = _factory.CreateClient();
        var token = GenerateJwtToken("user-123", "User");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var response = await client.GetAsync("/api/v1/admin/payments");
        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task PublicSubmitPaymentProof_CreatesPaymentAndMirrorsCRMRequest()
    {
        var publicClient = _factory.CreateClient();
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // 1. Submit public payment proof
        var submitRes = await publicClient.PostAsJsonAsync("/api/v1/payments", new
        {
            clientName = "John Doe",
            email = "john@example.com",
            whatsapp = "+123456789",
            serviceTitle = "Full-Stack Development",
            amount = "500",
            currency = "USD",
            methodId = "vodafone_cash",
            proofPath = "proofs/john_doe_receipt.jpg",
            proofFilename = "receipt.jpg",
            proofType = "image/jpeg",
            proofSizeBytes = 102400
        });

        Assert.Equal(HttpStatusCode.OK, submitRes.StatusCode);

        // 2. Admin lists payments and verifies payment is listed
        var listPaymentsRes = await adminClient.GetAsync("/api/v1/admin/payments");
        Assert.Equal(HttpStatusCode.OK, listPaymentsRes.StatusCode);
        var paymentsEnvelope = await listPaymentsRes.Content.ReadFromJsonAsync<ApiResponse<List<AdminPaymentSubmissionDto>>>();
        Assert.NotNull(paymentsEnvelope?.Data);
        var payment = paymentsEnvelope.Data.FirstOrDefault(p => p.Email == "john@example.com");
        Assert.NotNull(payment);
        Assert.Equal("John Doe", payment.ClientName);
        Assert.Equal("pending_review", payment.StatusState);
        Assert.Equal("proofs/john_doe_receipt.jpg", payment.ProofPath);

        // 3. Admin lists CRM requests and verifies CRM request was mirrored with deposit_pending
        var listRequestsRes = await adminClient.GetAsync("/api/v1/admin/requests");
        Assert.Equal(HttpStatusCode.OK, listRequestsRes.StatusCode);
        var requestsEnvelope = await listRequestsRes.Content.ReadFromJsonAsync<ApiResponse<List<AdminContactMessageDto>>>();
        Assert.NotNull(requestsEnvelope?.Data);
        var crmRequest = requestsEnvelope.Data.FirstOrDefault(r => r.Email == "john@example.com");
        Assert.NotNull(crmRequest);
        Assert.Equal("deposit_pending", crmRequest.StatusState);
        Assert.Contains("Payment proof submitted — 500 USD via vodafone_cash", crmRequest.Message);
    }

    [Fact]
    public async Task AdminUpdatePaymentSubmissionStatusAndNotes_FullLifecycle()
    {
        var publicClient = _factory.CreateClient();
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Submit payment
        var submitRes = await publicClient.PostAsJsonAsync("/api/v1/payments", new
        {
            clientName = "Alice Smith",
            email = "alice@example.com",
            amount = "250",
            currency = "EUR",
            proofPath = "proofs/alice_receipt.png"
        });
        Assert.Equal(HttpStatusCode.OK, submitRes.StatusCode);

        // Fetch payment ID
        var listPaymentsRes = await adminClient.GetAsync("/api/v1/admin/payments");
        var paymentsEnvelope = await listPaymentsRes.Content.ReadFromJsonAsync<ApiResponse<List<AdminPaymentSubmissionDto>>>();
        var item = paymentsEnvelope?.Data?.FirstOrDefault(p => p.Email == "alice@example.com");
        Assert.NotNull(item);

        // Update status to approved
        var statusRes = await adminClient.PatchAsJsonAsync($"/api/v1/admin/payments/{item.Id}/status", new
        {
            statusState = "approved"
        });
        Assert.Equal(HttpStatusCode.OK, statusRes.StatusCode);

        // Update note
        var noteRes = await adminClient.PostAsJsonAsync($"/api/v1/admin/payments/{item.Id}/notes", new
        {
            adminNote = "Verified bank deposit."
        });
        Assert.Equal(HttpStatusCode.OK, noteRes.StatusCode);

        // Delete payment submission
        var deleteRes = await adminClient.DeleteAsync($"/api/v1/admin/payments/{item.Id}");
        Assert.Equal(HttpStatusCode.NoContent, deleteRes.StatusCode);

        // Verify deleted
        var getRes = await adminClient.GetAsync($"/api/v1/admin/payments/{item.Id}");
        Assert.Equal(HttpStatusCode.NotFound, getRes.StatusCode);
    }

    [Fact]
    public async Task InvalidStatus_Returns400ValidationError()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var randomId = Guid.NewGuid();
        var response = await adminClient.PatchAsJsonAsync($"/api/v1/admin/payments/{randomId}/status", new
        {
            statusState = "invalid_status_value"
        });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task NotFoundBehavior_Returns404ForNonExistentSubmission()
    {
        var adminClient = _factory.CreateClient();
        var token = GenerateJwtToken("admin-999", "Administrator");
        adminClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var randomId = Guid.NewGuid();
        var response = await adminClient.PatchAsJsonAsync($"/api/v1/admin/payments/{randomId}/status", new
        {
            statusState = "approved"
        });

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetProof_Unauthenticated_Returns401()
    {
        var client = _factory.CreateClient();
        var res = await client.GetAsync($"/api/v1/admin/payments/{Guid.NewGuid()}/proof");
        Assert.Equal(HttpStatusCode.Unauthorized, res.StatusCode);
    }

    [Fact]
    public async Task GetProof_NonAdmin_Returns403()
    {
        var client = _factory.CreateClient();
        var token = GenerateJwtToken("user-123", "User");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var res = await client.GetAsync($"/api/v1/admin/payments/{Guid.NewGuid()}/proof");
        Assert.Equal(HttpStatusCode.Forbidden, res.StatusCode);
    }

    [Fact]
    public async Task GetProof_NonExistentPayment_Returns404()
    {
        var client = _factory.CreateClient();
        var token = GenerateJwtToken("admin-123", "Administrator");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var res = await client.GetAsync($"/api/v1/admin/payments/{Guid.NewGuid()}/proof");
        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }

    [Fact]
    public async Task GetProof_PaymentWithoutProof_Returns404()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();

        var entity = new PaymentSubmissionEntity
        {
            ClientName = "No Proof Client",
            ProofPath = null,
            StatusState = "pending_review"
        };
        db.PaymentSubmissions.Add(entity);
        await db.SaveChangesAsync();

        var client = _factory.CreateClient();
        var token = GenerateJwtToken("admin-123", "Administrator");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var res = await client.GetAsync($"/api/v1/admin/payments/{entity.Id}/proof");
        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }

    [Fact]
    public async Task GetProof_MissingPhysicalFile_Returns404()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();

        var entity = new PaymentSubmissionEntity
        {
            ClientName = "Missing File Client",
            ProofPath = "proofs/nonexistent_file_12345.png",
            StatusState = "pending_review"
        };
        db.PaymentSubmissions.Add(entity);
        await db.SaveChangesAsync();

        var client = _factory.CreateClient();
        var token = GenerateJwtToken("admin-123", "Administrator");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var res = await client.GetAsync($"/api/v1/admin/payments/{entity.Id}/proof");
        Assert.Equal(HttpStatusCode.NotFound, res.StatusCode);
    }

    [Fact]
    public async Task GetProof_PathTraversalAttempt_Returns400Or404()
    {
        using var scope = _factory.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();

        var entity = new PaymentSubmissionEntity
        {
            ClientName = "Hacker Client",
            ProofPath = "../../appsettings.json",
            StatusState = "pending_review"
        };
        db.PaymentSubmissions.Add(entity);
        await db.SaveChangesAsync();

        var client = _factory.CreateClient();
        var token = GenerateJwtToken("admin-123", "Administrator");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        var res = await client.GetAsync($"/api/v1/admin/payments/{entity.Id}/proof");
        Assert.True(res.StatusCode == HttpStatusCode.BadRequest || res.StatusCode == HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task GetProof_AuthorizedAdminWithPhysicalFile_Returns200FileStream()
    {
        var proofsDir = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", "proofs");
        Directory.CreateDirectory(proofsDir);

        var testFileName = $"test_proof_{Guid.NewGuid():N}.png";
        var testFilePath = Path.Combine(proofsDir, testFileName);
        await System.IO.File.WriteAllBytesAsync(testFilePath, new byte[] { 0x89, 0x50, 0x4E, 0x47 });

        try
        {
            using var scope = _factory.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();

            var entity = new PaymentSubmissionEntity
            {
                ClientName = "Valid Proof Client",
                ProofPath = $"proofs/{testFileName}",
                StatusState = "pending_review"
            };
            db.PaymentSubmissions.Add(entity);
            await db.SaveChangesAsync();

            var client = _factory.CreateClient();
            var token = GenerateJwtToken("admin-123", "Administrator");
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var res = await client.GetAsync($"/api/v1/admin/payments/{entity.Id}/proof");
            Assert.Equal(HttpStatusCode.OK, res.StatusCode);
            Assert.Equal("image/png", res.Content.Headers.ContentType?.MediaType);
            var contentBytes = await res.Content.ReadAsByteArrayAsync();
            Assert.Equal(4, contentBytes.Length);
        }
        finally
        {
            if (System.IO.File.Exists(testFilePath))
            {
                System.IO.File.Delete(testFilePath);
            }
        }
    }
}
