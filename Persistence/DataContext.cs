using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

// To add a reference (Domain) layer inside this layer (Persistence)
//Must navigate to Persistence folder and add reference with this command:
//        dotnet add reference ../Domain/Domain.csproj
// Then run the command:     dotnet restore


namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<Activity> Activities { get; set; }
    }
}