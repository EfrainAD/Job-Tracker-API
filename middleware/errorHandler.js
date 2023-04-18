import { getErrorMessage } from '../utils/errorHandler/errorHandler-utils.js'

const errorHandler = (err, req, res, next) => {
   const statusCode = err.statusCode || 500
   const errorMessage = err.message

   res.status(statusCode)
   res.json({
      message: errorMessage,
      stack: process.env.NODE_ENV === 'development' ? err.stack : null,
   })
}

export default errorHandler
