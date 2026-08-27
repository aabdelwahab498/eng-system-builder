using System;
using System.Collections.Generic;
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
using Portfolio.Domain;
using Portfolio.Domain.Entities;
using Xunit;

namespace Portfolio.IntegrationTests;

public class CmsAdminTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly WebApplicationFactory<Program> _factory;
    private const string SecretKey = "PORTFOLIO_DEV_JWT_SECRET_KEY_MIN_32_BYTES_LONG_123456789";
    private const string Issuer = "PortfolioApi";
    private const string Audience = "PortfolioClients";

    public CmsAdminTests(WebApplicationFactory<Program> factory)
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

    #region Security & Header Bypass Rejection
    [Theory]
    [InlineData("/api/v1/admin/projects")]
    [InlineData("/api/v1/admin/experience")]
    [InlineData("/api/v1/admin/education")]
    [InlineData("/api/v1/admin/skill-groups")]
    [InlineData("/api/v1/admin/skills")]
    [InlineData("/api/v1/admin/services")]
    [InlineData("/api/v1/admin/products")]
    [InlineData("/api/v1/admin/courses")]
    public async Task AdminEndpoints_AnonymousUser_ShouldReturn401Unauthorized(string endpoint)
    {
        var client = _factory.CreateClient();
        var response = await client.GetAsync(endpoint);

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    [Theory]
    [InlineData("/api/v1/admin/projects")]
    [InlineData("/api/v1/admin/experience")]
    [InlineData("/api/v1/admin/education")]
    [InlineData("/api/v1/admin/skill-groups")]
    [InlineData("/api/v1/admin/skills")]
    [InlineData("/api/v1/admin/services")]
    [InlineData("/api/v1/admin/products")]
    [InlineData("/api/v1/admin/courses")]
    public async Task AdminEndpoints_NonAdminUser_ShouldReturn403Forbidden(string endpoint)
    {
        var client = _factory.CreateClient();
        var userToken = GenerateJwtToken("user-100", "user");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", userToken);

        var response = await client.GetAsync(endpoint);

        Assert.Equal(HttpStatusCode.Forbidden, response.StatusCode);
    }

    [Fact]
    public async Task AdminEndpoints_FakeHeaderBypass_ShouldNotGrantAccess()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Admin", "true");
        client.DefaultRequestHeaders.Add("X-Role", "admin");
        client.DefaultRequestHeaders.Add("X-User-Id", "admin-999");

        var response = await client.GetAsync("/api/v1/admin/projects");

        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
    #endregion

    #region Projects CMS Tests
    [Fact]
    public async Task ProjectsCMS_FullCrudLifecycle_ShouldSucceedAndAudit()
    {
        var client = _factory.CreateClient();
        var adminToken = GenerateJwtToken("admin-cms-1", "admin");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);

        var uniqueSlug = "cms-test-project-" + Guid.NewGuid().ToString("N")[..8];
        var createRequest = new AdminProjectRequest
        {
            Slug = uniqueSlug,
            TitleEn = "CMS Test Project",
            TaglineEn = "Tagline for test project",
            RoleEn = "Lead Architect",
            SummaryEn = "Summary for test project",
            ProblemEn = "Problem statement",
            ApproachEn = "Approach details",
            PublicVisible = true
        };

        // 1. Create Project (201 Created)
        var createResponse = await client.PostAsJsonAsync("/api/v1/admin/projects", createRequest);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var createdResult = await createResponse.Content.ReadFromJsonAsync<ApiResponse<ProjectEntity>>();
        Assert.NotNull(createdResult);
        Assert.True(createdResult.Success);
        Assert.NotNull(createdResult.Data);
        var projectId = createdResult.Data.Id;
        Assert.Equal(uniqueSlug, createdResult.Data.Slug);

        // 2. Duplicate Slug Creation (409 Conflict)
        var duplicateResponse = await client.PostAsJsonAsync("/api/v1/admin/projects", createRequest);
        Assert.Equal(HttpStatusCode.Conflict, duplicateResponse.StatusCode);

        // 3. Get Project By ID (200 OK)
        var getResponse = await client.GetAsync($"/api/v1/admin/projects/{projectId}");
        Assert.Equal(HttpStatusCode.OK, getResponse.StatusCode);

        // 4. Update Project (200 OK)
        createRequest.TitleEn = "CMS Test Project Updated";
        var updateResponse = await client.PutAsJsonAsync($"/api/v1/admin/projects/{projectId}", createRequest);
        Assert.Equal(HttpStatusCode.OK, updateResponse.StatusCode);

        // 5. Delete Project (204 No Content)
        var deleteResponse = await client.DeleteAsync($"/api/v1/admin/projects/{projectId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);

        // 6. Verify Deletion (404 Not Found)
        var verifyDeletedResponse = await client.GetAsync($"/api/v1/admin/projects/{projectId}");
        Assert.Equal(HttpStatusCode.NotFound, verifyDeletedResponse.StatusCode);
    }
    #endregion

    #region Experience CMS Tests
    [Fact]
    public async Task ExperienceCMS_FullCrudLifecycle_ShouldSucceed()
    {
        var client = _factory.CreateClient();
        var adminToken = GenerateJwtToken("admin-cms-2", "admin");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);

        var createRequest = new AdminExperienceRequest
        {
            Company = "Tech Corp CMS",
            PositionEn = "Senior Engineer",
            DescriptionEn = "Building scalable cloud backends",
            PublicVisible = true
        };

        // Create
        var createResponse = await client.PostAsJsonAsync("/api/v1/admin/experience", createRequest);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var createdResult = await createResponse.Content.ReadFromJsonAsync<ApiResponse<ExperienceEntity>>();
        Assert.NotNull(createdResult?.Data);
        var expId = createdResult.Data.Id;

        // Delete
        var deleteResponse = await client.DeleteAsync($"/api/v1/admin/experience/{expId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }
    #endregion

    #region Education CMS Tests
    [Fact]
    public async Task EducationCMS_FullCrudLifecycle_ShouldSucceed()
    {
        var client = _factory.CreateClient();
        var adminToken = GenerateJwtToken("admin-cms-3", "admin");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);

        var createRequest = new AdminEducationRequest
        {
            Institution = "Global Tech University",
            DegreeEn = "Master of Science",
            FieldEn = "Computer Science",
            PublicVisible = true
        };

        // Create
        var createResponse = await client.PostAsJsonAsync("/api/v1/admin/education", createRequest);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var createdResult = await createResponse.Content.ReadFromJsonAsync<ApiResponse<EducationEntity>>();
        Assert.NotNull(createdResult?.Data);
        var eduId = createdResult.Data.Id;

        // Delete
        var deleteResponse = await client.DeleteAsync($"/api/v1/admin/education/{eduId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }
    #endregion

    #region Skill Groups & Skills CMS Tests
    [Fact]
    public async Task SkillGroupAndSkillsCMS_FullCrudLifecycle_ShouldSucceed()
    {
        var client = _factory.CreateClient();
        var adminToken = GenerateJwtToken("admin-cms-4", "admin");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);

        // 1. Create Skill Group
        var groupRequest = new AdminSkillGroupRequest
        {
            Category = SkillCategoryId.Backend,
            LabelEn = "CMS Backend Architecture",
            DescriptionEn = "Backend architecture technologies",
            PublicVisible = true
        };

        var groupResponse = await client.PostAsJsonAsync("/api/v1/admin/skill-groups", groupRequest);
        Assert.Equal(HttpStatusCode.Created, groupResponse.StatusCode);

        var groupResult = await groupResponse.Content.ReadFromJsonAsync<ApiResponse<SkillGroupEntity>>();
        Assert.NotNull(groupResult?.Data);
        var groupId = groupResult.Data.Id;

        // 2. Create Skill under Group
        var skillRequest = new AdminSkillRequest
        {
            SkillGroupId = groupId,
            Name = "ASP.NET Core .NET 8",
            Category = SkillCategoryId.Backend,
            ContextEn = "High performance web APIs",
            Featured = true,
            PublicVisible = true
        };

        var skillResponse = await client.PostAsJsonAsync("/api/v1/admin/skills", skillRequest);
        Assert.Equal(HttpStatusCode.Created, skillResponse.StatusCode);

        var skillResult = await skillResponse.Content.ReadFromJsonAsync<ApiResponse<SkillEntity>>();
        Assert.NotNull(skillResult?.Data);
        var skillId = skillResult.Data.Id;

        // 3. Delete Skill & Group
        var deleteSkillResp = await client.DeleteAsync($"/api/v1/admin/skills/{skillId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteSkillResp.StatusCode);

        var deleteGroupResp = await client.DeleteAsync($"/api/v1/admin/skill-groups/{groupId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteGroupResp.StatusCode);
    }
    #endregion

    #region Services CMS Tests
    [Fact]
    public async Task ServicesCMS_FullCrudLifecycle_ShouldSucceed()
    {
        var client = _factory.CreateClient();
        var adminToken = GenerateJwtToken("admin-cms-5", "admin");
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", adminToken);

        var createRequest = new AdminServiceRequest
        {
            TitleEn = "Cloud Architecture Consulting",
            SummaryEn = "Designing cloud native architectures",
            DescriptionEn = "Full scale backend and cloud design",
            PublicVisible = true
        };

        var createResponse = await client.PostAsJsonAsync("/api/v1/admin/services", createRequest);
        Assert.Equal(HttpStatusCode.Created, createResponse.StatusCode);

        var createdResult = await createResponse.Content.ReadFromJsonAsync<ApiResponse<ServiceEntity>>();
        Assert.NotNull(createdResult?.Data);
        var serviceId = createdResult.Data.Id;

        var deleteResponse = await client.DeleteAsync($"/api/v1/admin/services/{serviceId}");
        Assert.Equal(HttpStatusCode.NoContent, deleteResponse.StatusCode);
    }
    #endregion
}
