using API.Extensions;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers(opt=>
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));  //It means every single endpoints in every controllers now require authentication
});

//All other services defined inside API -> Extensions -> ApplicationServiceExtensions to make our Program.cs housekeeping
// This is an Extension Method
builder.Services.AddApplicationServices(builder.Configuration);

builder.Services.AddIdentityServices(builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.

//our defined middleware should place in top of our pipeline middlewares
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors("CorsPolicy");  //Must match the key inside line 17 (CORS Policy) -- IMPORTANT: should be above the authorization!

app.UseAuthentication();  //Authentication must define before Authorization

app.UseAuthorization();

app.MapControllers();


// The using statement variable is kind of property definition that is temporary defined!
// And when our work with that gets finished, the garbage collector will disposed and destroyed that
using var scope = app.Services.CreateScope();  
var services = scope.ServiceProvider;

// This is just to update or if it is not exists, create a database automatically without writing a command 'update-database' !!
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context,userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex,"An error occurred during migration");
}

app.Run();
