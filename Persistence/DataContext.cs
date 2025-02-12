using Microsoft.EntityFrameworkCore;
using Domain;

// To add a refrence (Domain) layer inside this layer (Persistence)
//Must navigate to Persistence folder and add refrence with this command:
//        dotnet add reference ../Domain/Domain.csproj
// Then run the command:     dotnet restore


namespace Persistence
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        public DbSet<Activity> Activities { get; set; }
    }
}