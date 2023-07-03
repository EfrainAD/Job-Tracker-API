import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema(
   {
      name: {
         type: String,
         required: [true, `User's name is required`],
      },
      email: {
         type: String,
         required: [true, `User's email is required`],
         unique: true,
         trim: true,
         match: [
            /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
            'Email not valid',
         ],
      },
      emailConfirmed: {
         type: Boolean,
         default: false,
      },
      password: {
         type: String,
         required: [true, `A user's password is required`],
         minLength: [
            60,
            'Encripted password must be at least 60 characters long',
         ],
      },
      photo: {
         type: String,
         required: [true, 'Must have a photo, Error should have a default'],
         default: 'https://i.ibb.co/4pDNDk1/avatar.png',
      },
      phone: {
         type: String,
         default: '+1',
      },
      bio: {
         type: String,
         maxLength: [250, 'Bio must be shorter then 250 characters long'],
         default: 'bio',
      },
      couches: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
         },
      ],
      couching: [
         {
            couchee: {
               type: mongoose.Schema.Types.ObjectId,
               ref: 'Couch',
            },
            active: {
               type: Boolean,
               default: false,
            },
         },
      ],
   },
   {
      toJSON: {
         transform: function (doc, ret) {
            delete ret.password
            return ret
         },
      },
      timestamps: true,
   }
)

// Encrypt Password
userSchema.pre('validate', async function (next) {
   try {
      if (this.isModified('password') || this.isNew) {
         const salt = await bcrypt.genSalt(10)
         const hashedPassword = await bcrypt.hash(this.password, salt)
         this.password = hashedPassword
      }
      next()
   } catch (error) {
      next(error)
   }
})

// findOneAndUpdate
userSchema.pre('findOneAndUpdate', async function (next) {
   const update = this.getUpdate()

   if (!update.password || typeof update.password !== 'string') {
      return next()
   }

   try {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(update.password, salt)

      this.getUpdate().password = hashedPassword
      next()
   } catch (error) {
      return next(error)
   }
})

// userSchema.pre('save', async function (next) {
//    try {
//       console.log('hi pass')
//       if (this.isModified('password')) {
//          const salt = await bcrypt.genSalt(10)
//          const hashedPassword = await bcrypt.hash(this.password, salt)
//          this.password = hashedPassword
//       }
//       next()
//    } catch (error) {
//       next(error)
//    }
// })

export default mongoose.model('User', userSchema)
