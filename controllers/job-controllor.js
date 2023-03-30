import Job from '../models/job-model.js'
import asyncHandler from 'express-async-handler'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'
import { isCreateJobFormValidated } from '../utils/user/job-utils.js'

// Create Job
export const createJob = asyncHandler(async (req, res, next) => {
   const body = req.body
   
   if (!isCreateJobFormValidated(body)) 
      throwError(res, 400, 'Missing one or more required fields')
   
   const job = await Job.create(req.body)
   res.status(201).json(job)
})

// Get All Jobs
export const getJobs = asyncHandler(async (req, res) => {
   const job = await Job.find({})
   res.status(201).json(job)
})