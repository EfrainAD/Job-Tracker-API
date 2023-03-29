import { getErrorMessage } from "../utils/errorHandler/errorHandler-utils.js"

const errorHandler = (err, req, res, next) => {
     const errorMessage = err.message
     
     res.json({
          message: errorMessage,
          stack: process.env.NODE_ENV === 'development' ? err.stack : null
     })
}

export default errorHandler