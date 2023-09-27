import mongoose from 'mongoose'
import { isCompanyRef } from '../utils/model/model.utils.js'

const companySchema = new mongoose.Schema(
   {
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'User',
      },
      companyName: {
         type: String,
         required: [true, 'The company name is required'],
         trim: true,
      },
      companyLinkedInUrl: {
         type: String,
         trim: true,
      },
      companyOfficialUrl: {
         type: String,
         trim: true,
      },
      peersOutreach: {
         type: Boolean,
         required: true,
         default: false,
      },
      companySize: {
         type: String,
         trim: true,
      },
   },
   {
      timestamps: true,
   }
)

companySchema.pre('findOneAndDelete', async function () {
   const companyId = this.getFilter()._id

   if (await isCompanyRef(companyId)) {
      throw new Error('error: This is being referenced by another document.')
   }
})

export default mongoose.model('Company', companySchema)
