import { throwError } from '../errorHandler/errorHandler-utils.js'
import { EXPIRES_IN_MINUTES } from '../variables/globalVariables.js'
import submitEmail from './emailSender.js'

export const isValidEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

   return emailRegex.test(email)
}

export const emailActions = {
   resetPassword: 'resetpassword',
   verifyemail: 'verifyemail',
}

const emailTemplate = {
   resetpassword: {
      subject: 'Reset Password Request',
      discription: `email to reset the user's password`,
      minutesEmailExpires: EXPIRES_IN_MINUTES,
      message: ({ name }, resetUrl, { minutesEmailExpires }) => `
         <h2>Hello ${name}</h2>
         <p>You requested a password reset</p>
         <p>Please use the url below to reset your password</p>
         <p>This link is valid for only ${minutesEmailExpires} minutes.</p>

         <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>

         <p>Regards...</p>
         <p>Job Tracker Team</p>`,
   },
   verifyemail: {
      subject: 'Verify Email',
      minutesEmailExpires: EXPIRES_IN_MINUTES,
      discription: 'email to verify your account',
      message: ({ name }, resetUrl, { minutesEmailExpires }) => `
         <h2>Hello ${name}</h2>
         <p>Your email needs to be verified</p>
         <p>Please use the url below to to verify your email</p>
         <p>This link is valid for only ${minutesEmailExpires} minutes.</p>

         <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>

         <p>Regards...</p>
         <p>Job Tracker Team</p>
      `,
   },
}

export const sendEmail = async (user, resetToken, action) => {
   const template = emailTemplate[action]
   if (!template) throwError(500, `Invalid email action: ${action}`)

   const resetUrl = `${
      process.env.FRONT_PAGE_URL || 'http://127.0.0.1:3000'
   }/${action}/${resetToken}`
   const subject = template.subject
   const send_to = user.email
   const sent_from = process.env.EMAIL_USER
   const message = template.message(user, resetUrl, template)

   try {
      await submitEmail(subject, message, send_to, sent_from)
      return {
         success: true,
         message: `An ${template.discription} has been sent`,
      }
   } catch (error) {
      console.log(
         `Failed to send the ${template.discription}, the error message returned: ${error}`
      )
      throwError(
         500,
         `Failed to send the ${template.discription}, the error message returned: ${error.message}`
      )
   }
}
