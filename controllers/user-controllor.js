import User from '../models/user-model.js'
import asyncHandler from 'express-async-handler'
import {
   isRegistorFormValidated,
   checkIfUserExists,
   createNewUserObj,
   isSignInFormValidated,
   isPasswordCorrect,
   isPasswordTooShort,
   isPasswordTooLong,
   isChangePasswordFormFilled,
} from '../utils/user/user-utils.js'
import {
   createStoredToken,
   deleteStoredToken,
   createHashedToken,
   getUserFromHashedStoredToken,
   saveStoredToken,
} from '../utils/token/stored-token-utils.js'
import {
   createSessionToken,
   isTokenValid,
} from '../utils/token/session-token-utils.js'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'
import {
   emailActions,
   isValidEmail,
   sendEmail,
} from '../utils/email/email-utils.js'
const oneDayInMilliseconds = 1000 * 60 * 60 * 24 // 1 day in milliseconds
import {
   signImgCredentials,
   uploadImage,
} from '../services/cloudinary/cloudinary.service.js'
import {
   MAX_PASSWORD_LENGTH,
   MIN_PASSWORD_LENGTH,
} from '../utils/variables/globalVariables.js'

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
      throwError(400, 'You need both email and passowrd')

   const user = await User.findOne({ email })
   if (!checkIfUserExists(user)) throwError(400, 'user or password is invalid')

   if ((await isPasswordCorrect(user, password)) !== true)
      throwError(401, 'user or password is invalid')

   const { _id, name, photo, phone, bio } = user

   // Create cookie
   const token = createSessionToken(_id)
   res.cookie('token', token, {
      path: '/',
      httpOnly: true,
      expires: new Date(Date.now() + oneDayInMilliseconds), // a day latter
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

export const signInStatus = asyncHandler(async (req, res) => {
   const token = req.cookies.token

   if (!token) return res.json(false)

   const verified = isTokenValid(token)
   return res.json(verified)
})

// Get Users Info
export const getUser = asyncHandler(async (req, res) => {
   const user = req.user

   // Path should be pertected
   if (!user) {
      throwError(500, `Server Error: Improper use of get user's info function`)
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

   // Path should be pertected
   if (!user) {
      throwError(500, `Server Error: Improper use of get user's info function`)
   }

   const newUserObj = createNewUserObj(user, body)

   const updatedUser = await User.findOneAndUpdate({ _id }, newUserObj, {
      new: true,
      runValidators: true,
   }).select('-password')

   res.json(updatedUser)
})

// Update User's Profile Picture
export const updateUserPicture = asyncHandler(async (req, res) => {
   const { _id } = req.user
   const file = req.file

   const uploadedImage = await uploadImage(_id, file)

   // Update user's picture URL in database
   const updatedPhoto = await User.findOneAndUpdate(
      { _id },
      { photo: uploadedImage.secure_url },
      { new: true, runValidators: true }
   ).select('photo')

   res.json({
      success: true,
      message: 'Profile picture was updated successfully',
      updatedPhoto: updatedPhoto.photo,
   })
})

// User Updates Password
export const updatePassword = asyncHandler(async (req, res) => {
   const { _id } = req.user
   const { old_password, new_password } = req.body
   const user = await User.findOne({ _id })

   // Path should be pertected
   if (!user) {
      throwError(500`Server Error: Improper use of get user's info function`)
   }

   if (!isChangePasswordFormFilled(old_password, new_password))
      throwError(400, 'You are missing fields')
   if (isPasswordTooShort(new_password))
      throwError(
         400,
         `Password must be at least ${MIN_PASSWORD_LENGTH} characters long`
      )
   if (isPasswordTooLong(new_password))
      throwError(
         400,
         `Password must be shorter then ${MAX_PASSWORD_LENGTH} characters long`
      )

   if (!(await isPasswordCorrect(user, old_password))) {
      throwError(401, 'Wrong password')
   }

   const updatedUser = await User.findOneAndUpdate(
      { _id },
      { password: new_password },
      { new: true, runValidators: true }
   )

   res.json(updatedUser)
})

// User Request to Reset their Password
export const requestPasswordReset = asyncHandler(async (req, res) => {
   const { email } = req.body

   if (!email) throwError(400, `Email address was not provided`)
   if (!isValidEmail(email)) throwError(400, `This is not valid email address`)

   const user = await User.findOne({ email: email })
   if (!user) throwError(400, `User does not exist by that email`)

   // If user has any unused or expired tokens
   deleteStoredToken(user._id)

   // Create & Encrypt Token
   const resetToken = await createStoredToken(user._id)
   const hashedToken = createHashedToken(resetToken)

   saveStoredToken(user._id, hashedToken)

   const response = await sendEmail(
      user,
      resetToken,
      emailActions.resetPassword
   )
   // console.log('stored token:', resetToken)

   res.status(200).json(response)
   // res.status(200).json(resetToken)
})

// User Reset their Password from Email Token.
export const resetPassword = asyncHandler(async (req, res) => {
   const { new_password } = req.body
   const { resetToken } = req.params
   const hashedToken = createHashedToken(resetToken)

   // Validation
   if (!new_password) throwError(400, 'Password Field is requried')
   if (!resetToken) throwError(404, 'Bad link')

   // Get a validated user's token from DB
   let user
   try {
      user = await getUserFromHashedStoredToken(hashedToken)
   } catch (error) {
      throwError(404, error)
   }

   await User.findOneAndUpdate(
      { _id: user._id },
      { password: new_password, emailConfirmed: true },
      { new: true, runValidators: true }
   )

   deleteStoredToken(user._id)

   res.status(200).json({
      success: true,
      message: 'Password Reset Successful',
   })
})

// Request Email Verification
export const requestEmailVerification = asyncHandler(async (req, res) => {
   const { email } = req.body

   if (!email) throwError(400, `Email address was not provided`)
   if (!isValidEmail(email)) throwError(400, `This is not valid email address`)

   const user = await User.findOne({ email: email })
   if (!user) throwError(400, `User does not exist by that email`)

   // If user has any from former unused stored token
   deleteStoredToken(user._id)

   // Create & Encrypt Token
   const resetToken = await createStoredToken(user._id)
   const hashedToken = createHashedToken(resetToken)

   saveStoredToken(user._id, hashedToken)

   const response = await sendEmail(user, resetToken, emailActions.verifyemail)

   res.status(200).json(response)
})

// Verify the user's email
export const verifyEmail = asyncHandler(async (req, res) => {
   const { verificationToken } = req.params
   const hashedToken = createHashedToken(verificationToken)

   // Validation
   if (!verificationToken) throwError(404, 'Bad link')

   // Get a validated user's token from DB
   let user
   try {
      user = await getUserFromHashedStoredToken(hashedToken)
   } catch (error) {
      throwError(404, error)
   }

   await User.findOneAndUpdate(
      { _id: user._id },
      { emailConfirmed: true },
      { new: true, runValidators: true }
   )

   deleteStoredToken(user._id)

   res.status(200).json({
      success: true,
      message: 'Verified Email Successful',
   })
})

// Signature for uploading an image from the client side
export const signImageUploadCredentials = (req, res) => {
   const fileName = req.user._id
   const folder = 'Job Tracker App'

   const { timestamp, signature, api_key } = signImgCredentials(
      fileName,
      folder
   )

   res.status(200).json({ timestamp, signature, api_key, folder })
}

// Get All Users // TO BE REMOVED
export const getUsers = asyncHandler(async (req, res) => {
   const user = await User.find({}).populate({
      path: 'couches',
      select: 'name',
   })
   res.status(201).json(user)
})
