using API.Extensions;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

//All other services defined inside API -> Extensions -> ApplicationServiceExtensions to make our Program.cs housekeeping
// This is an Extension Method
builder.Services.AddApplicationServices(builder.Configuration);  

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors("CorsPolicy");  //Must match the key inside line 17 (CORS Policy) -- IMPORTANT: should be above the authorization!

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
    await context.Database.MigrateAsync();
    await Seed.SeedData(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex,"An error occured during migration");
}

app.Run();
