// import User from '../models/user-model.js'
import mongoose from 'mongoose'
import asyncHandler from 'express-async-handler'
import Couch from '../models/couch-model.js'
import User from '../models/user-model.js'
import { checkIfUserExists } from '../utils/user/user-utils.js'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'

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

   const find = await Couch.find({ couch: newCouch._id, couchee: _id })

   if (find.length === 0) {
      await Couch.create({
         couch: newCouch._id,
         couchee: _id,
         active: false,
      })
   }

   res.json({
      successful: true,
   })
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

   const couch = await User.findOne({ email })

   if (!checkIfUserExists(couch))
      throwError(400, `Couch not found, double check the email provided`)

   // Start Transaction
   const session = await mongoose.startSession()
   session.startTransaction()

   try {
      // Update the requesting user's couch field
      const usersCouches = await User.findOneAndUpdate(
         { _id },
         { $pull: { couches: couch._id } },
         { session, new: true }
      )
         .select('-_id couches')
         .populate({ path: 'couches', select: 'name' })

      // Update the couch's field for the user being added as a person being couched
      const couchStatus = await Couch.deleteOne({
         couch: couch,
         couchee: _id,
      })

      await session.commitTransaction()
      session.endSession()

      res.json({
         usersCouches: usersCouches.couches,
         couchStatus,
      })
   } catch (error) {
      await session.abortTransaction()
      session.endSession()
      throwError(500, `Transaction aborted: ${error}`)
   }
})

// Change if couchee the person couching is active
export const updateUserCouchee = asyncHandler(async (req, res) => {
   const user = req.user
   const { _id } = user
   const { coucheeId, active } = req.body

   if (!user) {
      throwError(500, `Server Error: Improper use of get user's info function`)
   }
   if (!coucheeId || typeof active !== 'boolean') {
      throwError(400, `You need the the couchee's id and new status`)
   }

   // const update = await Couch.findOneAndUpdate(
   const update = await Couch.findOneAndUpdate(
      { couch: _id, couchee: coucheeId },
      { active },
      { new: true }
   )

   res.json({ couchee: update })
})

// ADMIN Find all couch documents // To Be removed
export const getAllCouches = asyncHandler(async (req, res) => {
   const couches = await Couch.find({})
      .populate({ path: 'couch', select: 'name email' })
      .populate({ path: 'couchee', select: 'name email' })
   res.status(201).json(couches)
})
