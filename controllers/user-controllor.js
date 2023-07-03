import User from '../models/user-model.js'
import mongoose from 'mongoose'
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
   getUserFromHashedResetToken,
} from '../utils/user/user-utils.js'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'
import {
   isValidEmail,
   sendEmailVerificationEmail,
   sendPasswordResetEmail,
} from '../utils/email/email-utils.js'
const oneDayInMilliseconds = 1000 * 60 * 60 * 24 // 1 day in milliseconds
import {
   signImgCredentials,
   uploadImage,
} from '../services/cloudinary/cloudinary.service.js'

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

   // ToDo: If users has couchs or couching send an error.

   const newUserObj = createNewUserObj(user, body)

   const updatedUser = await User.findOneAndUpdate({ _id }, newUserObj, {
      new: true,
      runValidators: true,
   }).select('-password')

   res.json(updatedUser)
})

// Add User's Couch
export const addUserCouch = asyncHandler(async (req, res) => {
   const user = req.user
   const { _id } = user
   const email = req.body.email

   if (!user) {
      throwError(500, `Server Error: Improper use of get user's info function`)
   }
   if (!email) {
      throwError(400, `You need the the couch's email`)
   }

   const newCouch = await User.findOne({ email })

   if (!checkIfUserExists(newCouch))
      throwError(400, `Couch not found, double check the email provided`)

   // Start Transaction
   const session = await mongoose.startSession()
   session.startTransaction()

   try {
      // Update the requesting user's couch field
      const usersCouches = await User.findOneAndUpdate(
         { _id },
         { $addToSet: { couches: newCouch._id } },
         { session, new: true }
      )
         .select('-_id couches')
         .populate({ path: 'couches', select: 'name' })

      // Update the couch's field for the user being added as a person being couched
      await User.updateOne(
         { _id: newCouch._id, 'couching.couchee': { $ne: _id } },
         { $push: { couching: { couchee: _id, active: false } } },
         { session }
      )

      await session.commitTransaction()
      session.endSession()

      res.json({
         usersCouches: usersCouches.couches,
      })
   } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throwError(500, `Transaction aborted: ${error}`)
   }
})

// Remove User's Couch
export const removeUserCouch = asyncHandler(async (req, res) => {
   const user = req.user
   const { _id } = user
   const email = req.body.email

   if (!user) {
      throwError(500, `Server Error: Improper use of get user's info function`)
   }
   if (!email) {
      throwError(400, `You need the the couch's email`)
   }

   const newCouch = await User.findOne({ email })

   if (!checkIfUserExists(newCouch))
      throwError(400, `Couch not found, double check the email provided`)

   // Start Transaction
   const session = await mongoose.startSession()
   session.startTransaction()

   try {
      // Update the requesting user's couch field
      const usersCouches = await User.findOneAndUpdate(
         { _id },
         { $pull: { couches: newCouch._id } },
         { session, new: true }
      )
         .select('-_id couches')
         .populate({ path: 'couches', select: 'name' })

      // Update the couch's field for the user being added as a person being couched
      await User.updateOne(
         { _id: newCouch._id, 'couching.couchee': _id },
         { $pull: { couching: { couchee: _id } } },
         { session }
      )

      await session.commitTransaction()
      session.endSession()

      res.json({
         usersCouches: usersCouches.couches,
      })
   } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throwError(500, `Transaction aborted: ${error}`)
   }
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
      throwError(400, 'Password must be at least 8 characters long')
   if (isPasswordTooLong(new_password))
      throwError(400, 'Password must be shorter then 23 characters long')

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

   // If user has any
   clearPasswordResetToken(user._id)

   // Create & Encrypt Token
   const resetToken = await createPasswordResetToken(user._id)
   const hashedToken = createHashedToken(resetToken)

   savePasswordResetToken(user._id, hashedToken)

   const response = await sendPasswordResetEmail(user, resetToken)

   res.status(200).json(response)
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
      user = await getUserFromHashedResetToken(hashedToken)
   } catch (error) {
      throwError(404, error)
   }

   await User.findOneAndUpdate(
      { _id: user._id },
      { password: new_password },
      { new: true, runValidators: true }
   )

   clearPasswordResetToken(user._id)

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

   // If user has any
   clearPasswordResetToken(user._id)

   // Create & Encrypt Token
   const resetToken = await createPasswordResetToken(user._id)
   const hashedToken = createHashedToken(resetToken)

   savePasswordResetToken(user._id, hashedToken)

   const response = await sendEmailVerificationEmail(user, resetToken)

   res.status(200).json(response)
})

// Verify the user's email
export const verifyEmail = asyncHandler(async (req, res) => {
   const { resetToken } = req.params
   const hashedToken = createHashedToken(resetToken)

   // Validation
   if (!resetToken) throwError(404, 'Bad link')

   // Get a validated user's token from DB
   let user
   try {
      user = await getUserFromHashedResetToken(hashedToken)
   } catch (error) {
      throwError(404, error)
   }

   await User.findOneAndUpdate(
      { _id: user._id },
      { emailConfirmed: true },
      { new: true, runValidators: true }
   )

   clearPasswordResetToken(user._id)

   res.status(200).json({
      success: true,
      message: 'Verified Email Successful',
   })
})

// Signature for uploading an image from the client side
export const signImageUploadCredentials = (req, res) => {
   const userId = req.user._id

   const { timestamp, signature, api_key } = signImgCredentials(userId)

   res.status(200).json({ timestamp, signature, api_key })
}

// Get All Users // TO BE REMOVED
export const getUsers = asyncHandler(async (req, res) => {
   const user = await User.find({})
   res.status(201).json(user)
})
