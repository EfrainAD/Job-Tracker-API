import User from '../models/user-model.js'
import asyncHandler from 'express-async-handler'

// Create User
export const createUser = asyncHandler(async (req, res, next) => {
   if (!req.body.name) {
      res.status(400)
      throw new Error('Missing one or more required fields')
   }
   const user = await User.create(req.body)
   res.status(201).json(user)
})

// Get All Users
export const getUsers = asyncHandler(async (req, res) => {
   const user = await User.find({})
   res.status(201).json(user)
})