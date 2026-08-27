using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Portfolio.Infrastructure.Persistence;

public static class DataSeeder
{
    public static async Task SeedAsync(PortfolioDbContext db)
    {
        var seedMode = Environment.GetEnvironmentVariable("DATABASE_SEED_MODE");
        if (seedMode == "disabled")
        {
            return;
        }

        // Idempotently import canonical content
        await CanonicalDataImporter.ImportCanonicalDataAsync(db);
    }
}
