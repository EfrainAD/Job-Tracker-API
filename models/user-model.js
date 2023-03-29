import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = mongoose.Schema({
     name: {
          type: String,
          required: [true, `User's name is required`]
     },
     email: {
          type: String,
          required: [true, `User's email is required`],
          unique: true,
          trim: true,
          match: [
               /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
               "Email not valid"
          ],
     },
     password: {
          type: String,
          required: [true, `A user's password is required`],
          minLength: [8, 'Password must be at least 8 characters long'],
          maxLength: [50, 'Password must be no more then 50 characters long']
     },
     photo: {
          type: String,
          required: [true, 'Must have a photo, Error should have a default'],
          default: 'https://i.ibb.co/4pDNDk1/avatar.png'
     },
     phone: {
          type: String,
          default: '+1'
     },
     bio: {
          type: String,
          maxLength: [250, 'Bio must be shorter then 250 characters long'],
          default: 'bio'
     }
}, {
     toJSON: {
       transform: function(doc, ret) {
         delete ret.password;
         return ret;
       }
     },
     timestamps: true
})

// Encrypt Password
userSchema.pre('save', async function(next) {
     if (!this.isModified('password')) 
          return next()

     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(this.password, salt)
     this.password = hashedPassword
     next()
})

export default mongoose.model('User', userSchema)