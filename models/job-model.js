import mongoose from 'mongoose'
import Company from './company-model.js'
import { isCompanyRef } from '../utils/model/model.utils.js'

const jobSchema = new mongoose.Schema(
   {
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'User',
      },
      company: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'Company',
      },
      jobTitle: {
         type: String,
         required: [true, 'The job title is required'],
         trim: true,
      },
      jobBoardURL: {
         type: String,
         trim: true,
      },
      jobURL: {
         type: String,
         trim: true,
      },
      jobSource: {
         type: String,
         trim: true,
      },
      easyApply: {
         type: Boolean,
      },
      remote: {
         type: String,
         enum: ['remote', 'on-site', 'hybrid', null],
         trim: true,
      },
      notes: {
         type: String,
         trim: true,
      },
      jobLocation: {
         type: String,
         trim: true,
      },
      jobalyticsRating: {
         type: Number,
         min: 0,
         max: 100,
      },
      requiredExperience: {
         type: String,
         trim: true,
      },
      resume: {
         type: String,
         trim: true,
      },
      coverLetter: {
         type: String,
         trim: true,
      },
      dateApplied: {
         type: Date,
         required: [true, 'The application date is required'],
      },
      rejectionDate: {
         type: Date,
      },
      rejectionReason: {
         type: String,
         trim: true,
      },
      firstInterviewDate: {
         type: Date,
      },
      technicalChallengeInterviewDate: {
         type: Date,
      },
      secondInterviewDate: {
         type: Date,
      },
   },
   {
      timestamps: true,
   }
)

jobSchema.post('findOneAndDelete', async function (doc) {
   const companyId = doc.company

   if (!(await isCompanyRef(companyId))) {
      const res = await Company.findByIdAndDelete(companyId)

      if (!res) {
         console.error(
            'Company failed to be deleted, after deleting a job, and the company no longer being ref by anything.'
         )
      }
   }
})

export default mongoose.model('Job', jobSchema)
