namespace Application.Core
{
    public class AppException
    {

        //we have two role of exceptions:     developer mode exceptions   -   product mode exceptions
        // in developer mode exceptions details, we have large useful information but those information are not useful for client to see!
        // because of that we set details by default to null because we do not want to populate that when we are in product mode

        public AppException(int statusCode, string message, string details = null)
        {
            StatusCode = statusCode;
            Message = message;
            Details = details;
        }

        public int StatusCode { get; set; }
        public string Message { get; set; }
        public string Details { get; set; }
    }
}