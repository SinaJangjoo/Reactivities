using System.Net;
using System.Text.Json;
using Application.Core;

namespace API.Middleware
{
    public class ExceptionMiddleware
    {
        //  RequestDelegate  -> our request processing
        //  ILogger  -> logging our any actions that we do inside
        //  IHostEnvironment  ->  To check if we rae in development mode or production mode
        private readonly RequestDelegate _next;
        private readonly ILogger<ExceptionMiddleware> _logger;
        private readonly IHostEnvironment _env;

        public ExceptionMiddleware(RequestDelegate next, ILogger<ExceptionMiddleware> logger, IHostEnvironment env)
        {
            _next = next;
            _logger = logger;
            _env = env;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                // define exception middleware logic inside here

                // 1- log the error
                _logger.LogError(ex, ex.Message);   

                // because we are OUTSIDE API controllers we have to define that type which is default API controllers type
                context.Response.ContentType = "application/json"; 

                // 2- define status code  (500)
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;  

                // 3-  define our Response Body related on our environment mode!
                var response = _env.IsDevelopment()
                ? new AppException(context.Response.StatusCode, ex.Message , ex.StackTrace.ToString())  //development mode
                : new AppException(context.Response.StatusCode, "Internal Server Error");  //production mode

                // 4- Create our JSON Response and returning that back by Writing that Asynchronously
                var options = new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase};
                var json = JsonSerializer.Serialize(response,options);
                await context.Response.WriteAsync(json);
            }
        }
    }
}