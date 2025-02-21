using Application.Activities;
using Application.Core;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<DataContext>(opt => {
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));   // our connection string inside appsettings.Development.json
});

//CORS Policy  --  (When we run react app we have to do this here if we get CORS Policy!)
builder.Services.AddCors(opt=>{
    opt.AddPolicy("CorsPolicy", policy=>{
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
    });
});

// This is a registration for our Mediator List Handler as a service
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(List.Handler).Assembly));

// This is a registration for AutoMapper as a service
builder.Services.AddAutoMapper(typeof(MappingProfiles).Assembly);


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
