using System;
using System.Security.Cryptography;
using System.Text;

namespace Portfolio.Application.Security;

public static class PasswordHasher
{
    public static string HashPassword(string password)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes("PortfolioSaltKey2026SecurePasswordHashingKey"));
        var hash = hmac.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hash);
    }

    public static bool VerifyPassword(string password, string storedHash)
    {
        var hash = HashPassword(password);
        return CryptographicOperations.FixedTimeEquals(
            Encoding.UTF8.GetBytes(hash),
            Encoding.UTF8.GetBytes(storedHash)
        );
    }
}
