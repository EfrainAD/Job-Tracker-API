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