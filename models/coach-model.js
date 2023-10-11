import mongoose from 'mongoose'

const coachSchema = mongoose.Schema(
   {
      coach: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
      },
      coachee: {
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

export default mongoose.model('Coach', coachSchema)
