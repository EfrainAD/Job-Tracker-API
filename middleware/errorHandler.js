import { getErrorMessage } from "../utils/errorHandler/errorHandler-utils.js"

const errorHandler = (err, req, res, next) => {
     
     const statusCode = res.statusCode ? res.statusCode : 500
     res.status(statusCode)

     const errorMessage = err.message ? err.message : getErrorMessage(statusCode)
     
     res.json({
          message: errorMessage,
          stack: process.env.NODE_ENV === 'development' ? err.stack : null
     })
}

export default errorHandler