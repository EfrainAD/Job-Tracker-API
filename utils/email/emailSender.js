import mailMan from 'nodemailer'

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
   const transporter = mailMan.createTransport({
      host: process.env.EMAIL_HOST,
      port: 587,
      auth: {
         user: process.env.EMAIL_USER,
         pass: process.env.EMAIL_PASS,
      },
      // tls: {
      //      rejectUnauthorized: false
      // },
   })

   // Option for sending email
   const options = {
      from: sent_from,
      to: send_to,
      replyTo: reply_to,
      subject: subject,
      html: message,
   }

   try {
      const res = await transporter.sendMail(options)
      console.log('transporter.sendMail response:', res)
   } catch (error) {
      throw new Error(error.message)
   }
}

export default sendEmail
