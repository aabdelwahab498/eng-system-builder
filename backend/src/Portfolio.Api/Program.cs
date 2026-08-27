using System.IO;
using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Portfolio.Api.Middleware;
using Portfolio.Application.Validators;
using Portfolio.Infrastructure.Persistence;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Portfolio Backend API",
        Version = "v1",
        Description = "Production-grade Backend API foundation for Portfolio Architecture"
    });
});

// Configure Database Connection (PostgreSQL EF Core / InMemory fallback for non-prod local build)
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (!string.IsNullOrWhiteSpace(connectionString) && !connectionString.Contains("YOUR_POSTGRES_CONNECTION_STRING"))
{
    builder.Services.AddDbContext<PortfolioDbContext>(options =>
        options.UseNpgsql(connectionString));
}
else
{
    builder.Services.AddDbContext<PortfolioDbContext>(options =>
        options.UseInMemoryDatabase("PortfolioDevDb"));
}

// FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<ContactMessageValidator>();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173", "http://localhost:8080")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Middleware Pipeline
app.UseMiddleware<CorrelationIdMiddleware>();
app.UseMiddleware<ExceptionHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "Portfolio API v1"));
}

app.UseCors("AllowFrontend");
app.UseAuthorization();
app.MapControllers();

// Seed dev database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<PortfolioDbContext>();
    if (db.Database.IsInMemory() || db.Database.CanConnect())
    {
        await DataSeeder.SeedAsync(db);
    }
}

app.Run();

// Required for WebApplicationFactory in integration tests
public partial class Program { }
