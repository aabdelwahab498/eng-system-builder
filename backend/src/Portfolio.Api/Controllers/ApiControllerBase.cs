using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Portfolio.Application.DTOs;

namespace Portfolio.Api.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public abstract class ApiControllerBase : ControllerBase
{
    protected string Locale => Request.Query["locale"].ToString() is { Length: > 0 } loc ? loc : "en";
    protected string CorrelationId => HttpContext.Items["X-Correlation-ID"]?.ToString() ?? string.Empty;

    protected IActionResult OkResponse<T>(T data)
    {
        return Ok(ApiResponse<T>.Ok(data, Locale, CorrelationId));
    }

    protected IActionResult FailResponse(string code, string message, List<string>? details = null, int statusCode = 400)
    {
        return StatusCode(statusCode, ApiResponse<object>.Fail(code, message, details, CorrelationId));
    }
}
