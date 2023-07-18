import mongoose from 'mongoose'

const couchSchema = mongoose.Schema(
   {
      couch: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
      },
      couchee: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
      },
      active: {
         type: Boolean,
         default: false,
      },
   },
   {
      timestamps: true,
   }
)

export default mongoose.model('Couch', couchSchema)
