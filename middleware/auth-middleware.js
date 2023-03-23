import asyncHandler from 'express-async-handler'
import User from '../models/user-model.js'
import { getUserIdFromToken } from '../utils/user/user-utils.js'


const requireUserAuth = asyncHandler(async (req, res, next) => {
     const token = req.cookies.token

     const _id = getUserIdFromToken(token, res)

     // Get User
     const user = await User.findOne({_id}).select('-password')
     if (!user) {
          res.status(401)
          throw new Error()
     }

     req.user = user
     next()
})

export default requireUserAuth