import Job from '../models/job-model.js'
import asyncHandler from 'express-async-handler'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'
import { isCreateJobFormValidated } from '../utils/Job/job-utils.js'

// Create Job
export const createJob = asyncHandler(async (req, res, next) => {
   const userId = req.user._id
   const body = req.body

   if (!isCreateJobFormValidated(body))
      throwError(400, 'Missing one or more required fields')

   const newJob = { ...body, owner: userId }

   const job = await Job.create(newJob)

   res.status(201).json(job)
})

// Get All User's Jobs
export const getJobs = asyncHandler(async (req, res) => {
   const userId = req.user._id

   const jobs = await Job.find({ owner: userId })
      .select(
         'companyName jobTitle remote recruiter dateApplied rejectionDate firstInterviewDate technicalChallengeInterviewDate secondInterviewDate'
      )
      .populate('recruiter')

   res.status(200).json(jobs)
})

// Get A Job
export const getJob = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const jobId = req.params.id

   const job = await Job.findOne({ owner: userId, _id: jobId }).populate(
      'recruiter'
   )

   if (!job) {
      throwError(
         404,
         'Job not found, job does not exist or user does not have access.'
      )
   }

   res.status(200).json(job)
})

// Update Job - PATCH
export const updateJob = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const jobId = req.params.id
   const body = req.body

   const updatedBody = { ...body, owner: userId }

   // Add recruiter
   if (updatedBody.recruiter) {
      updatedBody.$addToSet = {
         recruiter: updatedBody.recruiter,
      }
      delete updatedBody.recruiter
   }

   const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, owner: userId },
      updatedBody,
      { new: true, runValidators: true }
   ).populate('recruiter', 'name')

   if (!updatedJob) {
      throwError(
         404,
         'Job not found, job does not exist or user does not have access.'
      )
   }

   res.status(200).json(updatedJob)
})

// Remove recruiter from Job
export const removeRecruiterFromJob = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const jobId = req.params.id
   const { recruiter } = req.body

   if (!recruiter) {
      throwError(400, 'Recruiter to remove is required')
   }

   const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, owner: userId },
      { $pull: { recruiter } },
      { new: true, runValidators: true }
   ).populate('recruiter', 'name')

   if (!updatedJob) {
      throwError(
         404,
         'Job not found, job does not exist or user does not have access.'
      )
   }

   res.status(200).json(updatedJob)
})

// DELETE - Job
export const deleteJob = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const productId = req.params.id

   const job = await Job.findOneAndDelete({ owner: userId, _id: productId })

   if (job === null)
      throwError(
         404,
         'Job not found, it does not exist or user does not have access.'
      )

   res.status(204).send()
})

// Get All Jobs
export const getALLJobs = asyncHandler(async (req, res) => {
   const job = await Job.find({}).populate('user', 'name, email')
   res.status(201).json(job)
})
