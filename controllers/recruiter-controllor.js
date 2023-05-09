import Recruiter from '../models/recruiter-model.js'
import asyncHandler from 'express-async-handler'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'
import { isCreateRecruiterFormValidated } from '../utils/user/recruiter-utils.js'

// Create Recruiter
export const createRecruiter = asyncHandler(async (req, res, next) => {
   const userId = req.user._id
   const body = req.body

   if (!isCreateRecruiterFormValidated(body))
      throwError(400, 'Missing one or more required fields')

   const newRecruiter = { ...body, user: userId }

   const recruiter = await Recruiter.create(newRecruiter)

   res.status(201).json(recruiter)
})

// Get All User's Recruiters
export const getRecruiters = asyncHandler(async (req, res) => {
   const userId = req.user._id

   const recruiters = await Recruiter.find({ user: userId })

   res.status(200).json(recruiters)
})

// Get A Recruiter
export const getRecruiter = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const recruiterId = req.params.id

   const recruiter = await Recruiter.findOne({ user: userId, _id: recruiterId })

   if (!recruiter) {
      throwError(
         404,
         'Recruiter not found, recruiter does not exist or user does not have access.'
      )
   }

   res.status(200).json(recruiter)
})

// Update Recruiter - PATCH
export const updateRecruiter = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const recruiterId = req.params.id
   const body = req.body

   const updatedBody = { ...body, user: userId }

   const updatedRecruiter = await Recruiter.findOneAndUpdate(
      { _id: recruiterId, user: userId },
      updatedBody,
      { new: true, runValidators: true }
   )

   if (!updatedRecruiter) {
      throwError(
         404,
         'Recruiter not found, recruiter does not exist or user does not have access.'
      )
   }

   res.status(200).json(updatedRecruiter)
})
