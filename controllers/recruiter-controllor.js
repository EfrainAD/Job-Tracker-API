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
