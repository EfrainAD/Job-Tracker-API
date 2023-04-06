import sendEmail from './emailSender.js'

export const isValidEmail = (email) => {
   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

   return emailRegex.test(email)
}

export const sendPasswordRestEmail = async (user, resetToken) => {
   const resetUrl = `${process.env.FRONT_PAGE_URL}/resetpassword/${resetToken}`
   const minutesEmailExpires = process.env.EXPIRES_IN_MINUTES
   const subject = 'Reset Password Request'
   const send_to = user.email
   const sent_from = process.env.EMAIL_USER
   const message = `
        <h2>hello ${user.name}</h2>
        <p>You requested a password reset</p>
        <p>Please use the url below to reset your password</p>
        <p>This link is valid for only ${minutesEmailExpires} minutes.</p>

        <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>

        <p>Regards...</p>
        <p>Stock Management Team</p>
   `
   console.log('hi')
   try {
      await sendEmail(subject, message, send_to, sent_from)
      return {
         sussess: true,
         message: 'A reset email has been sent',
      }
   } catch (error) {
      throw new Error(
         "Failed to send the email to reset the user's password, message return:",
         error
      )
   }
}
