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

   const newRecruiter = { ...body, owner: userId }

   const recruiter = await Recruiter.create(newRecruiter)

   res.status(201).json(recruiter)
})

// Get All User's Recruiters
export const getRecruiters = asyncHandler(async (req, res) => {
   const userId = req.user._id

   const recruiters = await Recruiter.find({ owner: userId }).populate({
      path: 'company',
      select: 'companyName -_id',
   })

   res.status(200).json(recruiters)
})

// Get A Recruiter
export const getRecruiter = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const recruiterId = req.params.id

   const recruiter = await Recruiter.findOne({
      owner: userId,
      _id: recruiterId,
   }).populate({ path: 'company', select: 'companyName companySize' })

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

   const updatedBody = { ...body, owner: userId }

   const updatedRecruiter = await Recruiter.findOneAndUpdate(
      { _id: recruiterId, owner: userId },
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

// DELETE - Recruiter
export const deleteRecruiter = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const productId = req.params.id

   const recruiter = await Recruiter.findOneAndDelete({
      owner: userId,
      _id: productId,
   })

   if (!recruiter)
      throwError(
         404,
         'Recruiter not found, it does not exist or user does not have access.'
      )

   res.status(204).send()
})

// Get All Recruiters REMOVED AT END OF PROJECT
export const getALLRecruiters = asyncHandler(async (req, res) => {
   const recruiter = await Recruiter.find({}).populate({
      path: 'owner',
      select: 'name email',
   })

   res.status(201).json(recruiter)
})
