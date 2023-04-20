const nodemailer = require('nodemailer')
const ejs = require('ejs')

const sendEmail = async (options) => {
  try {
    //Create the transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
    //Send message
    let receiver = options.email
    let verification_url = options.verification_url
    const data = await ejs.renderFile(__dirname + '/templates/index.ejs', {
      receiver,
      verification_url
    })

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.email,
      subject: options.subject,
      html: data
    }
    await transporter.sendMail(mailOptions)
  } catch (error) {
    return error
  }
}

module.exports = { sendEmail }
