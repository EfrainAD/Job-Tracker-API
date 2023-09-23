import mongoose from 'mongoose'

const companySchema = new mongoose.Schema(
   {
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'User',
      },
      name: {
         type: String,
         required: [true, 'The company name is required'],
         trim: true,
      },
      linkedInUrl: {
         type: String,
         trim: true,
      },
      officialUrl: {
         type: String,
         trim: true,
      },
      peersOutreach: {
         type: Boolean,
         required: true,
         default: false,
      },
      size: {
         type: String,
         trim: true,
      },
   },
   {
      timestamps: true,
   }
)

export default mongoose.model('Company', companySchema)
