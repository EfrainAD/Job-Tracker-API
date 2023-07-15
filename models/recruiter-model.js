import mongoose from 'mongoose'

const recruiterSchema = new mongoose.Schema(
   {
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         require: true,
         ref: 'User',
      },
      name: {
         type: String,
         required: [true, 'The recruiter name is required'],
         trim: true,
      },
      company: {
         type: String,
         required: [true, 'The company name is required'],
         trim: true,
      },
      url: {
         type: String,
         trim: true,
      },
      notes: {
         type: String,
         trim: true,
      },
      outreachMethod: {
         type: String,
         enum: ['linkedin', 'email', 'both'],
         default: null, // Means not sent
      },
      outreachDate: {
         type: Date,
      },
      acceptedOutreach: {
         type: Boolean,
         default: false,
      },
      conversationDate: {
         type: Date,
         default: null,
      },
   },
   {
      timestamps: true,
   }
)

export default mongoose.model('Recruiter', recruiterSchema)
