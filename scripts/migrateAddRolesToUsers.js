import mongoose from 'mongoose'
import User from '../models/user-model.js'

const MONGO_DB = 'mongodb://localhost:27017/Job-Tracker'

try {
   await mongoose.connect(MONGO_DB)

   const updateMany = await User.updateMany(
      {},
      { $set: { roles: ['couchee'] } },
      {
         new: true,
         runValidators: true,
      }
   )

   const findOne = await User.findOne({})

   console.log(updateMany)
   console.log(findOne)
} catch (error) {
   console.error('Error in migrating users:', error)
} finally {
   console.log('Data Changed successfully')
   mongoose.connection.close()
}
