using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Portfolio.Application.DTOs;
using Portfolio.Application.Security;
using Portfolio.Domain.Entities;
using Portfolio.Infrastructure.Persistence;

namespace Portfolio.Api.Controllers;

[Route("api/v1/[controller]")]
public class AuthController : ApiControllerBase
{
    private readonly PortfolioDbContext _db;
    private readonly IConfiguration _config;
    private readonly IValidator<LoginRequest> _validator;

    public AuthController(PortfolioDbContext db, IConfiguration config, IValidator<LoginRequest> validator)
    {
        _db = db;
        _config = config;
        _validator = validator;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var valResult = await _validator.ValidateAsync(request);
        if (!valResult.IsValid)
        {
            var errors = valResult.Errors.Select(e => e.ErrorMessage).ToList();
            return FailResponse("VALIDATION_ERROR", "Login request payload is invalid.", errors);
        }

        var normalizedEmail = request.Email.Trim().ToLowerInvariant();
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == normalizedEmail && u.IsActive);

        if (user == null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return FailResponse("INVALID_CREDENTIALS", "Invalid email or password.", statusCode: 401);
        }

        var secretKey = _config["Jwt:SecretKey"] ?? "PORTFOLIO_DEV_JWT_SECRET_KEY_MIN_32_BYTES_LONG_123456789";
        var issuer = _config["Jwt:Issuer"] ?? "PortfolioApi";
        var audience = _config["Jwt:Audience"] ?? "PortfolioClients";
        var expirationHours = 24;

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var expiresAt = DateTimeOffset.UtcNow.AddHours(expirationHours);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim("role", user.Role)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiresAt.UtcDateTime,
            signingCredentials: creds
        );

        var tokenString = new JwtSecurityTokenHandler().WriteToken(token);

        var response = new LoginResponse
        {
            Token = tokenString,
            ExpiresAt = expiresAt,
            User = new UserDto
            {
                Id = user.Id.ToString(),
                Email = user.Email,
                Roles = [user.Role]
            }
        };

        return OkResponse(response);
    }
}

