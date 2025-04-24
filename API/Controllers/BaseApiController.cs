using Application.Core;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BaseApiController : ControllerBase
    {
        //"private" means we can use IMediator only inside this class 
        private IMediator _mediator;


        // "protected" means we can use IMediator in this class and all other inherited classes from this class
        // This line of code says if _mediator was exists use that, if not and that was null use the own service directly
        // "??=" means: If _mediator is null, then assign it a value."Otherwise, return the existing _mediator value
        //we set _mediator as a lazy-loaded property to avoid wasting resources by instantiating it unnecessarily
        //Using lazy loading, the _mediator is not initialized at the beginning. It is only created when needed.
        protected IMediator Mediator => _mediator ??=
        HttpContext.RequestServices.GetService<IMediator>();

        // To handle Validations and check success, null or failure result once for all time inside all actions 
        protected ActionResult HandleResult<T>(Result<T> result)
        {
            if(result ==  null) return NotFound();
            if (result.IsSuccess && result.Value != null)
                return Ok(result.Value); // result.Value = activity
            if (result.IsSuccess && result.Value == null)
                return NotFound();
            return BadRequest(result.Error);
        } 
    }
}