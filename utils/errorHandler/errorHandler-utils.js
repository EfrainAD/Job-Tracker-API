export const getErrorMessage = (statusCode) => {
   switch (statusCode) {
      case 401:
         return 'Unauthorized'
         break

      default:
         return 'Unknown Error'
         break
   }
}

// export const throwError = (statusCode = 500, errorMessage = null) => {
//    if (errorMessage === null)
//       getErrorMessage(statusCode)
//    res.status(statusCode)
//    throw new Error(errorMessage)
// }
export const throwError = (statusCode = 500, errorMessage = null) => {
   if (errorMessage === null) errorMessage = getErrorMessage(statusCode)

   const error = new Error(errorMessage)

   error.statusCode = statusCode
   console.log('HIHIHIHI')
   throw error
}
