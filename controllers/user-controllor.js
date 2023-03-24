import User from '../models/user-model.js'
import asyncHandler from 'express-async-handler'
import { createToken, validateIfUserExists, validateSignInFields, validateIfPasswordCorrect, checkIfUser, getNewUserObj, validateRegistorFields } from '../utils/user/user-utils.js'
const oneDayInMilliseconds = 1000 * 60 * 60 * 24; // 1 day in milliseconds

// Create User
export const createUser = asyncHandler(async (req, res, next) => {
   const body = req.body

   validateRegistorFields(body, res)

   const {password, ...user} = await User.create(body)
   res.status(201).json(user)
})

// Sign In
export const signInUser = asyncHandler(async (req, res) => {
   const {email, password} = req.body

   validateSignInFields(email, password, res)

   const user = await User.findOne({email})
   validateIfUserExists(user, res)

   await validateIfPasswordCorrect(user, password, res)
         
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
   
   checkIfUser(user)

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
   
   checkIfUser(user)

   const newUserObj = getNewUserObj(user, body)

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