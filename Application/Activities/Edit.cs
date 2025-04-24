using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            //This is what we are going to want to receive as a parameter from our API
            public Activity Activity { get; set; }
        }

        //--------------------------- Validating Area (Fluent Validation)

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
            }
        }

        //---------------------------------------------------------------


        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _context.Activities.FindAsync(request.Activity.Id);

                if(activity == null) return null;

                // activity.Title = request.Activity.Title ?? activity.Title;
                // _mapper.Map(coming from base , going to update);
                _mapper.Map(request.Activity, activity);  //Defined a mapper inside Application -> Core -> MappingConfig

                var result = await _context.SaveChangesAsync() > 0;  // It means the SaveChanges happened!
                if (!result) return Result<Unit>.Failure("Failed to update the activity");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}