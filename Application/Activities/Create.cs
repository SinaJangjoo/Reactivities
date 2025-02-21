using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest  //Commands does not return anything because of that we said IRequest simply
        {
            //This is what we are going to want to recieve as a parameter from our API
            public Activity Activity { get; set; } // We pass Activity as a parameter
        }

        public class Handler : IRequestHandler<Command>  // Once again we do not have return from this. Thus we just have Command!
        {
            private readonly DataContext _context;

            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task Handle(Command request, CancellationToken cancellationToken)
            {
                //We do not set AddAsync! because we don't touch Database directly at this moment!
                //we just keep this inside memory and because of that we don't need to set this asynchronously

                _context.Activities.Add(request.Activity);
                await _context.SaveChangesAsync();
            }
        }
    }
}