import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'User',
   },
   companyName: {
      type: String,
      required: [true, 'The company name is required'],
      trim: true,
   },
   companySize: {
      type: String,
      trim: true,
   },
   jobTitle: {
      type: String,
      required: [true, 'The job title is required'],
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
   remote: {
      type: String,
      enum: ['remote', 'on-site', 'hybrid'],
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
   recruiter: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'Recruiter',
      },
   ],
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
})

export default mongoose.model('Job', jobSchema)
