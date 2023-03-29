export const getErrorMessage = (statusCode) => {
   switch (statusCode) {
      case 401:
         return 'Unauthorized'
         break;
   
      default:
         return 'Unknown Error'
         break;
   }
}

export const throwError = (res, statusCode = 500, errorMessage = null) => {
   if (errorMessage === null)  
      getErrorMessage(statusCode)
   res.status(statusCode)
   throw new Error(errorMessage)
}