// import User from '../models/user-model.js'
import mongoose from 'mongoose'
import asyncHandler from 'express-async-handler'
import Coach from '../models/coach-model.js'
import User from '../models/user-model.js'
import { checkIfUserExists } from '../utils/user/user-utils.js'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'

// Add User's Coach
export const addUserCoach = asyncHandler(async (req, res) => {
   const user = req.user
   const { _id } = user
   const email = req.body.email

   if (!user) {
      throwError(500, `Server Error: Improper use of get user's info function`)
   }
   if (!email) {
      throwError(400, `You need the the coach's email`)
   }

   const newCoach = await User.findOne({ email })

   if (!checkIfUserExists(newCoach))
      throwError(400, `Coach not found, double check the email provided`)

   const find = await Coach.find({ coach: newCoach._id, coachee: _id })

   if (find.length === 0) {
      await Coach.create({
         coach: newCoach._id,
         coachee: _id,
         active: false,
      })
   }

   res.json({
      successful: true,
   })
})

export const getUserCoaches = asyncHandler(async (req, res) => {
   const user = req.user
   const { _id } = user

   if (!user) {
      throwError(500, `Server Error: Improper use of get user's info function`)
   }

   const coaches = await Coach.find({ coachee: _id })
      .select('coach')
      .populate({ path: 'coach', select: 'email name -_id' })

   res.json(coaches)
})

// Remove User's Coach
export const removeCoach = asyncHandler(async (req, res) => {
   const user = req.user
   const { _id: userId } = req.user
   const { id: coachId } = req.params
   const email = req.body.email

   if (!user) {
      throwError(500, `Server Error: Improper use of get user's info function`)
   }

   const find = await Coach.findOneAndDelete({ _id: coachId, coachee: userId })

   if (find) res.json({ successful: true })
   else throwError(400, 'Coach not found')
})

// Change if coachee the person coaching is active
export const updateUserCoachee = asyncHandler(async (req, res) => {
   const user = req.user
   const { _id } = user
   const { coacheeId, active } = req.body

   if (!user) {
      throwError(500, `Server Error: Improper use of get user's info function`)
   }
   if (!coacheeId || typeof active !== 'boolean') {
      throwError(400, `You need the the coachee's id and new status`)
   }

   // const update = await Coach.findOneAndUpdate(
   const update = await Coach.findOneAndUpdate(
      { coach: _id, coachee: coacheeId },
      { active },
      { new: true }
   )

   res.json({ coachee: update })
})

// ADMIN Find all coach documents // To Be removed
export const getAllCoaches = asyncHandler(async (req, res) => {
   const coaches = await Coach.find({})
      .populate({ path: 'coach', select: 'name email' })
      .populate({ path: 'coachee', select: 'name email' })
   res.status(201).json(coaches)
})
