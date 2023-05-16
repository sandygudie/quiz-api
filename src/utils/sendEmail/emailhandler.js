const nodemailer = require('nodemailer')
const ejs = require('ejs')
const sendEmail = async (options) => {
  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })

    let data
    if (options.verification_url) {
      let verification_url = options.verification_url
      data = await ejs.renderFile(__dirname + '/templates/verifyemail.ejs', {
        verification_url
      })
    } else {
      let reset_url = options.reset_url
      data = await ejs.renderFile(__dirname + '/templates/resetlink.ejs', {
        reset_url
      })
    }
    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.email,
      subject: options.subject,
      html: data
    }
    let response = await transporter.sendMail(mailOptions)
    if (response.response) {
      return response.response
    }
  } catch (error) {
    return error
  }
}

const emailVerification = async (user) => {
  const verification_url = `https://localhost:3000/email-verify/?${user.token}`
  let response = await sendEmail({
    email: user.email,
    subject: 'Verify your email address',
    verification_url: verification_url
  })
  return response
}

const passwordResetLink = async (user) => {
  const reset_url = `http://localhost:3000/reset-password/?${user.token}`
  let response = await sendEmail({
    email: user.email,
    subject: 'Reset Password',
    reset_url: reset_url
  })
  return response
}

module.exports = { sendEmail, emailVerification, passwordResetLink }
