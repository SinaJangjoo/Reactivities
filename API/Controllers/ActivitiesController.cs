using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    [ApiController]
    [Route("[controller]")]

    // This means we have some customized features inside BaseApiController
    // that we want other Controllers inherited them rather the default "ControllerBase" controller 
    public class ActivitiesController : BaseApiController
    {
        private readonly DataContext _context;

        public ActivitiesController(DataContext context)
        {
            _context = context;
        }


        [HttpGet] //api/activities
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            return await _context.Activities.ToListAsync();
        }

        [HttpGet("{id}")] //api/activities/{id}
        public async Task<ActionResult<Activity>> GetActivity(Guid id)  //the name if "id" should match with [HttpGet("{id}")]
        {
            // var activity = await _context.Activities.FindAsync(id);
            // return activity;

            return await _context.Activities.FindAsync(id);
        }
    }
}