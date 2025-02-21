using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    // [ApiController]
    // [Route("[controller]")]    //If we uncomment these two lines we cannot access datas from Postman!

    // This means we have some customized features inside BaseApiController
    // that we want other Controllers inherited them rather the default "ControllerBase" controller 
    public class ActivitiesController : BaseApiController
    {

        [HttpGet] //api/activities
        public async Task<ActionResult<List<Activity>>> GetActivities()
        {
            // 1- From Mediator defined in Application layer
            // 2- "Mediator" property defined in BaseApiController inside protected method
            return await Mediator.Send(new List.Query());
        }

        [HttpGet("{id}")] //api/activities/{id}
        public async Task<ActionResult<Activity>> GetActivity(Guid id)  //the name if "id" should match with [HttpGet("{id}")]
        {
            return await Mediator.Send(new Details.Query { Id = id });  // We pass the id with an object initializer to the Mediator
        }

        [HttpPost]
        //Because we don't want to return anything here we use IActionResult rather than ActionResult!
        public async Task<IActionResult> CreateActivity(Activity activity)
        {
            await Mediator.Send(new Create.Command { Activity = activity });
            return Ok();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditActivity(Guid id, Activity activity)
        {
            activity.Id = id;
            await Mediator.Send(new Edit.Command { Activity = activity });
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            await Mediator.Send(new Delete.Command{Id=id});
            return Ok();
        }
    }
}