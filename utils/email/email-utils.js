import { throwError } from '../errorHandler/errorHandler-utils.js'
import sendEmail from './emailSender.js'

export const isValidEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

   return emailRegex.test(email)
}

export const sendPasswordResetEmail = async (user, resetToken) => {
   const resetUrl = `${
      process.env.FRONT_PAGE_URL || 'http://127.0.0.1:3000'
   }/resetpassword/${resetToken}`
   const minutesEmailExpires = process.env.EXPIRES_IN_MINUTES
   const subject = 'Reset Password Request'
   const send_to = user.email
   const sent_from = process.env.EMAIL_USER
   const message = `
        <h2>Hello ${user.name}</h2>
        <p>You requested a password reset</p>
        <p>Please use the url below to reset your password</p>
        <p>This link is valid for only ${minutesEmailExpires} minutes.</p>

        <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>

        <p>Regards...</p>
        <p>Job Tracker Team</p>
   `

   try {
      await sendEmail(subject, message, send_to, sent_from)
      return {
         success: true,
         message: 'A reset email has been sent',
      }
   } catch (error) {
      throwError(
         500,
         `Failed to send the email to reset the user's password, the error message returned: ${error.message}`
      )
   }
}

export const sendEmailVerificationEmail = async (user, resetToken) => {
   const resetUrl = `${
      process.env.FRONT_PAGE_URL || 'http://127.0.0.1:3000'
   }/verifyemail/${resetToken}`
   const minutesEmailExpires = process.env.EXPIRES_IN_MINUTES
   const subject = 'Verify Email'
   const send_to = user.email
   const sent_from = process.env.EMAIL_USER
   const message = `
        <h2>Hello ${user.name}</h2>
        <p>Your email needs to be verified</p>
        <p>Please use the url below to to verify your email</p>
        <p>This link is valid for only ${minutesEmailExpires} minutes.</p>

        <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>

        <p>Regards...</p>
        <p>Job Tracker Team</p>
   `

   try {
      await sendEmail(subject, message, send_to, sent_from)
      return {
         success: true,
         message: 'A reset email has been sent',
      }
   } catch (error) {
      throwError(
         500,
         `Failed to send the email to verify your account, the error message returned: ${error.message}`
      )
   }
}
