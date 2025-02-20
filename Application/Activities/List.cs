
// In this class we have to define a logic


using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<List<Activity>> { }

        // Class to handle use cases
        public class Handler : IRequestHandler<Query, List<Activity>>
        {

            //To access our datas inside Database we have to access persistence layer with ctor
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            //Interface implementation
            public async Task<List<Activity>> Handle(Query request, CancellationToken cancellationToken)
            {
                return await _context.Activities.ToListAsync(); 
            }
        }
    }
}