import mongoose from 'mongoose'

const jobBoardSchema = new mongoose.Schema(
   {
      owner: {
         type: mongoose.Schema.Types.ObjectId,
         require: true,
         ref: 'User',
      },
      name: {
         type: String,
         required: [true, 'The jobBoard name is required'],
         trim: true,
      },
      searchUrl: {
         type: String,
         required: [true, 'The job board search url is required'],
         trim: true,
      },
      notes: {
         type: String,
         trim: true,
      },
   },
   {
      timestamps: true,
   }
)

export default mongoose.model('JobBoard', jobBoardSchema)
