import User from '../models/user-model.js'
import asyncHandler from 'express-async-handler'
import {
   createToken,
   isRegistorFormValidated,
   checkIfUserExists,
   createNewUserObj,
   isSignInFormValidated,
   isPasswordCorrect,
   isPasswordTooShort,
   isPasswordTooLong,
   isChangePasswordFormFilled,
   clearPasswordResetToken,
   createPasswordResetToken,
   createHashedToken,
   savePasswordResetToken,
} from '../utils/user/user-utils.js'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'
import {
   isValidEmail,
   sendPasswordResetEmail,
} from '../utils/email/email-utils.js'
const oneDayInMilliseconds = 1000 * 60 * 60 * 24 // 1 day in milliseconds

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
   const { email, password } = req.body

   if (!isSignInFormValidated(email, password))
      throwError(res, 400, 'You need both email and passowrd')

   const user = await User.findOne({ email })
   if (!checkIfUserExists(user))
      throwError(res, 400, 'user or password is invalid')

   if ((await isPasswordCorrect(user, password)) !== true)
      throwError(res, 401, 'user or password is invalid')

   const { _id, name, photo, phone, bio } = user

   // Create cookie
   const token = createToken(_id)
   res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + oneDayInMilliseconds), // a day lattedr
      sameSite: 'none',
      secure: true,
   })

   res.status(200).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
   })
})

// Sign Out
export const signOutUser = asyncHandler(async (req, res) => {
   res.cookie('token', '', {
      path: '/',
      httpOnly: true,
      expires: new Date(0),
      sameSite: 'none',
      secure: true,
   })
   res.status(200).json({ message: 'Signed Out Successful' })
})

// Get Users Info
export const getUser = asyncHandler(async (req, res) => {
   const user = req.user

   if (!user) {
      throwError(
         res,
         500`Server Error: Improper use of get user's info function`
      )
   }

   const { _id, name, email, photo, phone, bio } = user

   res.status(201).json({
      _id,
      name,
      email,
      photo,
      phone,
      bio,
   })
})

// Update User
export const updateUser = asyncHandler(async (req, res) => {
   const user = req.user
   const body = req.body
   const { _id } = user

   if (!user) {
      throwError(
         res,
         500`Server Error: Improper use of get user's info function`
      )
   }

   const newUserObj = createNewUserObj(user, body)

   const updatedUser = await User.findOneAndUpdate({ _id }, newUserObj, {
      new: true,
      runValidators: true,
   }).select('-password')

   res.json(updatedUser)
})

// User Udates Password
export const updatePassword = asyncHandler(async (req, res) => {
   const { _id } = req.user
   const { old_password, new_password } = req.body
   const user = await User.findOne({ _id })

   if (!user) {
      throwError(
         res,
         500`Server Error: Improper use of get user's info function`
      )
   }

   if (!isChangePasswordFormFilled(old_password, new_password))
      throwError(res, 400, 'You are missing fields')
   if (isPasswordTooShort(new_password))
      throwError(res, 400, 'Password must be at least 8 characters long')
   if (isPasswordTooLong(new_password))
      throwError(res, 400, 'Password must be shorter then 23 characters long')

   if (!(await isPasswordCorrect(user, old_password))) {
      throwError(res, 401, 'Wrong password')
   }

   const updatedUser = await User.findOneAndUpdate(
      { _id },
      { password: new_password },
      { new: true, runValidators: true }
   )

   res.json(updatedUser)
})

export const requestPasswordReset = asyncHandler(async (req, res) => {
   const { email } = req.body

   if (!email) throwError(res, 400, `Email address was not provided`)
   if (!isValidEmail(email))
      throwError(res, 400, `This is not valid email address`)

   const user = await User.findOne({ email: email })
   if (!user) throwError(res, 400, `User does not exist by that email`)

   // If user has any
   clearPasswordResetToken(user._id)

   // Create & Encrypt Token
   const resetToken = await createPasswordResetToken(user._id)
   const hashedToken = createHashedToken(resetToken)

   savePasswordResetToken(user._id, hashedToken)

   try {
      const response = await sendPasswordResetEmail(user, resetToken)
      res.status(200).json(response)
   } catch (error) {
      throwError(res, 500, error)
   }
})

// Get All Users // TO BE REMOVED
export const getUsers = asyncHandler(async (req, res) => {
   const user = await User.find({})
   res.status(201).json(user)
})
