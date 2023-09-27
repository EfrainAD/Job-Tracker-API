import recruiterModel from '../../models/recruiter-model.js'
import Job from '../../models/job-model.js'
import mongoose from 'mongoose'

export const isCompanyRef = async (companyId) => {
   const job = await Job.findOne({ company: companyId })

   if (job) return true

   const recruiter = await recruiterModel.findOne({ company: companyId })

   if (recruiter) return true

   return false
}

export const is_id = (id) => mongoose.Types.ObjectId.isValid(id)
