using System.Security.Cryptography.X509Certificates;
using Application.Core;
using Domain;
using MediatR;
using Persistence;


// This is for an individual activity (we had List before, this is a single activity)

namespace Application.Activities
{
    public class Details
    {
        public class Query : IRequest<Result<Activity>>
        {
            public Guid Id { get; set; }  // because it expects an Id as a parameter, we define a property
        }

        public class Handler : IRequestHandler<Query, Result<Activity>>
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }
            public async Task<Result<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                //We define our id inside Query! so we can access that by using "request" property
                var activity = await _context.Activities.FindAsync(request.Id);
                return Result<Activity>.Success(activity);


            }
        }
    }
}