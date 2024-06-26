import Job from '../models/job-model.js'
import asyncHandler from 'express-async-handler'
import { throwError } from '../utils/errorHandler/errorHandler-utils.js'
import {
   createJobBody,
   isCreateJobFormValidated,
} from '../utils/Job/job-utils.js'
import {
   createRecruiterBody,
   isCreateRecruiterAttributesValidated,
} from '../utils/recruiter/recruiter-utils.js'
import {
   createCompanyBody,
   isCreateCompanyAttributesValidated,
} from '../utils/company/company-utils.js'
import Company from '../models/company-model.js'
import { updateCompanyFunc } from './company-controllor.js'
import { is_id } from '../utils/model/model.utils.js'
import Coach from '../models/coach-model.js'
import Recruiter from '../models/recruiter-model.js'

// Create Job
export const createJob = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const body = req.body

   if (!isCreateJobFormValidated(body))
      throwError(400, 'Missing one or more required fields')

   const jobBody = createJobBody(body)

   // If the company is new and needs be added, add it here.
   if (!is_id(jobBody.company)) {
      const companyBody = createCompanyBody(body.company)

      if (!isCreateCompanyAttributesValidated(companyBody))
         throwError(400, 'Missing one or more required fields the company info')

      const newCompany = { ...companyBody, owner: userId }

      const { _id: companyId } = await Company.create(newCompany)

      jobBody.company = companyId
   }

   const newJob = { ...jobBody, owner: userId }

   const job = await Job.create(newJob)

   // If recruiters with this form, add them here
   for (const recruiter of body.recruiters) {
      const recruiterBody = createRecruiterBody(recruiter)

      if (!isCreateRecruiterAttributesValidated(recruiterBody))
         throwError(
            400,
            'Missing one or more required fields for one or more of the recruiters'
         )

      const newRecruiter = {
         ...recruiterBody,
         owner: userId,
         company: job.company._id,
      }

      await Recruiter.create(newRecruiter)
   }

   res.status(201).json(job)
})

// Get All User's Jobs
export const getJobs = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const coacheeId = req.params.id
   let ownerId = coacheeId ? coacheeId : userId

   if (coacheeId) {
      const find = await Coach.findOne({ coach: userId, coachee: coacheeId })

      if (!find) {
         throwError(
            404,
            'User not found, the user does not exist or you do not have access.'
         )
      }
   }

   const jobs = await Job.find({ owner: ownerId })
      .select(
         'companyName jobTitle remote recruiter dateApplied notes rejectionDate firstInterviewDate technicalChallengeInterviewDate secondInterviewDate'
      )
      .populate({ path: 'company', select: 'companyName peersOutreach _id' })
      .sort({ dateApplied: -1 })

   res.status(200).json(jobs)
})

// Get A Job
export const getJob = asyncHandler(async (req, res) => {
   const userId = req.user._id
   const jobId = req.params.id

   const job = await Job.findOne({ owner: userId, _id: jobId }).populate({
      path: 'company',
      select: 'companyName peersOutreach companySize _id',
   })

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

   if (body?.remote === 'null') {
      body.remote = null
   }

   const jobBody = createJobBody(body)
   console.log('jobBody', jobBody)

   if (body.company) {
      const companyBody = createCompanyBody(body.company)
      console.log('companyBody', companyBody)

      const newCompany = { ...companyBody, owner: userId }

      const { _id: companyId } = await Company.findOneAndUpdate(
         { _id: body.company._id, owner: userId },
         newCompany,
         { new: true, runValidators: true }
      )

      jobBody.company = companyId
   }

   const updatedBody = { ...jobBody, owner: userId }

   const updatedJob = await Job.findOneAndUpdate(
      { _id: jobId, owner: userId },
      updatedBody,
      { new: true, runValidators: true }
   ).populate('company')

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

   res.status(204).send(job)
})

// Get All Jobs
export const getALLJobs = asyncHandler(async (req, res) => {
   const job = await Job.find({})
      .populate({
         path: 'owner',
         select: 'name email',
      })
      .populate('company')

   res.status(201).json(job)
})
