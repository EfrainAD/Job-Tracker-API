import Job from '../models/job-model.js'
import asyncHandler from 'express-async-handler'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'
import { isCreateJobFormValidated } from '../utils/user/job-utils.js'

// Create Job
export const createJob = asyncHandler(async (req, res, next) => {
   const userId = req.user._id
   const body = req.body

   if (!isCreateJobFormValidated(body))
      throwError(400, 'Missing one or more required fields')

   const newJob = { ...body, user: userId }

   const job = await Job.create(newJob)

   res.status(201).json(job)
})

// Get All User's Jobs
export const getJobs = asyncHandler(async (req, res) => {
   const userId = req.user._id

   const jobs = await Job.find({ user: userId }).select(
      'companyName jobTitle remote recruiter dateApplied rejectionDate firstInterviewDate technicalChallengeInterviewDate secondInterviewDate'
   )
   // .populate('recruiter', '_id nam')

   res.status(200).json(jobs)
})
// Get A Job

// Update Job

// DELETE - Job
export const deleteJob = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const productId = req.params.id

   const job = await Job.findOneAndDelete({ user: userId, _id: productId })

   if (job === null)
      throwError(
         404,
         'Job not found, it does not exist or user does not have access.'
      )

   res.status(204).send()
})

// Get All Jobs
export const getALLJobs = asyncHandler(async (req, res) => {
   const job = await Job.find({})
   res.status(201).json(job)
})
