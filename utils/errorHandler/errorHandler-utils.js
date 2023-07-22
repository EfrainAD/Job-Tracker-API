export const getErrorMessage = (statusCode) => {
   switch (statusCode) {
      case 401:
         return 'Unauthorized'
         break

      case 500:
         return 'Internal Server Error'
         break

      default:
         return 'Unknown Error'
         break
   }
}

export const createErrorObj = (statusCode, errorMessage) => {
   const error = new Error(errorMessage)

   error.statusCode = statusCode
   return error
}

export const throwError = (statusCode = 500, errorMessage = null) => {
   if (!errorMessage) errorMessage = getErrorMessage(statusCode)

   const error = createErrorObj(statusCode, errorMessage)

   throw error
}
