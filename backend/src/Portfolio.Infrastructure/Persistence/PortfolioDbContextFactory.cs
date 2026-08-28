using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace Portfolio.Infrastructure.Persistence;

public class PortfolioDbContextFactory : IDesignTimeDbContextFactory<PortfolioDbContext>
{
    public PortfolioDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<PortfolioDbContext>();
        optionsBuilder.UseNpgsql("Host=localhost;Database=portfolio_dev;Username=postgres;Password=postgres");
        return new PortfolioDbContext(optionsBuilder.Options);
    }
}
