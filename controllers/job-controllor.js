import Job from '../models/job-model.js'
import asyncHandler from 'express-async-handler'

// Create Job
export const createJob = asyncHandler(async (req, res, next) => {
   if (!req.body.companyName) {
      res.status(400)
      throw new Error('Missing one or more required fields')
   }
   const job = await Job.create(req.body)
   res.status(201).json(job)
})

// Get All Jobs
export const getJobs = asyncHandler(async (req, res) => {
   const job = await Job.find({})
   res.status(201).json(job)
})