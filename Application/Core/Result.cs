using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    //We set this class as an generic class to use not only for Activity entity, but also all entities
    public class Result<T>
    {
        public bool IsSuccess { get; set; }
        public T Value { get; set; }
        public string Error { get; set; }

        public static Result<T> Success(T value) => new Result<T> { IsSuccess = true, Value = value };

        public static Result<T> Failure(string error) => new Result<T> { IsSuccess = false, Error = error };
    }
}