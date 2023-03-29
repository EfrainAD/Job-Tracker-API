import User from '../models/user-model.js'
import asyncHandler from 'express-async-handler'
import { createToken, isRegistorFormValidated, checkIfUserExists, createNewUserObj, isSignInFormValidated, isPasswordCorrect } from '../utils/user/user-utils.js'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js';
const oneDayInMilliseconds = 1000 * 60 * 60 * 24; // 1 day in milliseconds

// Create User
export const createUser = asyncHandler(async (req, res, next) => {
   const body = req.body

   if (!isRegistorFormValidated(body)) 
      throwError(res, 400, 'All fields are required')

   const user = await User.create(body)
   res.status(201).json(user)
})

// Sign In
export const signInUser = asyncHandler(async (req, res) => {
   const {email, password} = req.body

   if (!isSignInFormValidated(email, password)) 
      throwError(res, 400, 'You need both email and passowrd')

   const user = await User.findOne({email})
   if (!checkIfUserExists(user))
      throwError(res, 400, 'user or password is invalid')

   if (await isPasswordCorrect(user, password) !== true)
      throwError(res, 401, 'user or password is invalid')
         
   const {_id, name, photo, phone, bio} = user
   
   // Create cookie
   const token = createToken(_id)
   res.cookie('token', token, {
         path: '/',
         httpOnly: true,
         expires: new Date(Date.now() + oneDayInMilliseconds), // a day lattedr
         sameSite: 'none',
         secure: true
   })

   res.status(200).json({
         _id, name, email, photo, phone, bio
   })
})

// Sign Out
export const signOutUser = asyncHandler(async (req, res) => {
   res.cookie('token', '', {
        path: '/',
        httpOnly: true,
        expires: new Date(0), 
        sameSite: 'none',
        secure: true
   })
   res.status(200).json({message: 'Signed Out Successful'})
})

// Get Users Info
export const getUser = asyncHandler(async (req, res) => {
   const user = req.user
   
   if (!user) {
      throwError(res, 500 `Server Error: Improper use of get user's info function`)
   }

   const {_id, name, email, photo, phone, bio} = user

   res.status(201).json({
         _id, name, email, photo, phone, bio
   })
})

// Update User
export const updateUser = asyncHandler(async (req, res) => {
   const user = req.user
   const body = req.body
   const { _id } = user
   
   if (!user) {
      throwError(res, 500 `Server Error: Improper use of get user's info function`)
   }

   const newUserObj = createNewUserObj(user, body)

   const updatedUser = await User.findOneAndUpdate(
      {_id}, 
      newUserObj, 
      {new: true, runValidators: true}
   ).select('-password')
   
   res.json(updatedUser)
})

// Get All Users // TO BE REMOVED
export const getUsers = asyncHandler(async (req, res) => {
   const user = await User.find({})
   res.status(201).json(user)
})