import mongoose from 'mongoose'

const tokenSchema = mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user',
   },
   token: {
      type: String,
      required: true,
      unique: true,
   },
   createdAt: {
      type: Date,
      required: true,
   },
   expiresAt: {
      type: Date,
      required: true,
   },
})

export default mongoose.model('Token', tokenSchema)
