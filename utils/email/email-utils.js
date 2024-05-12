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
   contactemail: 'contactemail',
}

const emailTemplate = {
   resetpassword: {
      subject: 'Reset Password Request',
      discription: `email to reset the user's password`,
      minutesEmailExpires: EXPIRES_IN_MINUTES,
      message: ({ user, resetUrl, template }) => `
         <h2>Hello ${user.name}</h2>
         <p>You requested a password reset</p>
         <p>Please use the url below to reset your password</p>
         <p>This link is valid for only ${template.minutesEmailExpires} minutes.</p>

         <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>

         <p>Regards...</p>
         <p>Job Tracker Team</p>`,
   },
   verifyemail: {
      subject: 'Verify Email',
      minutesEmailExpires: EXPIRES_IN_MINUTES,
      discription: 'email to verify your account',
      message: ({ user, resetUrl, template }) => `
         <h2>Hello ${user.name}</h2>
         <p>Your email needs to be verified</p>
         <p>Please use the url below to to verify your email</p>
         <p>This link is valid for only ${template.minutesEmailExpires} minutes.</p>

         <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>

         <p>Regards...</p>
         <p>Job Tracker Team</p>
      `,
   },
   contactemail: {
      subject: 'Contat/bug Email',
      discription: 'email to report a bug',
      message: ({ user, usersMessage }) => `
         <h2>This message is from ${user.name}</h2>
         <p>${usersMessage}</p>
      `,
   },
}

export const sendEmail = async ({ user, resetToken, action, usersMessage }) => {
   const template = emailTemplate[action]
   const isUserRecipient = action !== emailActions.contactemail

   if (!template) throwError(500, `Invalid email action: ${action}`)

   const resetUrl = resetToken
      ? `${
           process.env.FRONT_PAGE_URL || 'http://127.0.0.1:3000'
        }/${action}/${resetToken}`
      : null
   const emailObj = {
      resetUrl,
      subject: template.subject,
      send_to: isUserRecipient ? user.email : process.env.EMAIL_USER,
      sent_from: process.env.EMAIL_USER,
      reply_to: isUserRecipient ? process.env.EMAIL_USER : user.email,
      message: template.message({ user, resetUrl, template, usersMessage }),
   }

   try {
      await submitEmail(emailObj)
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
