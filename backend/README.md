# Portfolio ASP.NET Core Backend Foundation

Production-grade C# / ASP.NET Core (.NET 8+) backend for the Portfolio Architecture Ecosystem.

## Architecture

This project is structured as a **Clean Architecture / Modular Monolith**:

- `Portfolio.Domain`: Core domain entities (`Profile`, `Project`, `Experience`, `Skill`, etc.), value objects, and business enums.
- `Portfolio.Application`: Data Transfer Objects (DTOs), validation rules (FluentValidation), and use case abstractions.
- `Portfolio.Infrastructure`: EF Core DbContext, PostgreSQL mappings, repositories, and data seeders.
- `Portfolio.Api`: ASP.NET Core REST API controllers, OpenAPI/Swagger documentation, Serilog logging, and middleware pipeline.
- `tests/`:
  - `Portfolio.UnitTests`: Domain rule & validation tests.
  - `Portfolio.IntegrationTests`: WebApplicationFactory HTTP integration tests.
  - `Portfolio.ContractTests`: API contract and DTO schema verification.

## Getting Started

### Prerequisites

- .NET 8.0 SDK or .NET 10.0 SDK
- Docker & Docker Compose (Optional for containerized PostgreSQL)

### Running Locally

```bash
cd backend
dotnet restore
dotnet build
dotnet run --project src/Portfolio.Api/Portfolio.Api.csproj
```

Swagger UI will be available at: `http://localhost:5000/swagger`

### Running Tests

```bash
cd backend
dotnet test
```

### Running with Docker Compose

```bash
cd backend
docker-compose up --build
```

### Health Check Endpoints

- Liveness Probe: `GET http://localhost:5000/healthz`
- Readiness Probe: `GET http://localhost:5000/readyz`
