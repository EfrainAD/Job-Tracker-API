import asyncHandler from 'express-async-handler'
import User from '../models/user-model.js'
import { getUserIdFromToken } from '../utils/user/user-utils.js'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'

const requireUserAuth = asyncHandler(async (req, res, next) => {
   const token = req.cookies.token
   const _id = getUserIdFromToken(token)

   // Get User
   const user = await User.findOne({ _id }).select('-password')
   if (!user) throwError(401, 'User not found')

   req.user = user
   next()
})

export default requireUserAuth
