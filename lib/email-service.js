const nodemailer = require('nodemailer')

export function createTransporter(config) {
  let transportConfig = {
    auth: {
      user: config.user,
      pass: config.pass
    }
  }

  if (config.service === 'gmail') {
    transportConfig = {
      ...transportConfig,
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false
    }
  } else if (config.service === 'outlook') {
    transportConfig = {
      ...transportConfig,
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      tls: {
        ciphers: 'SSLv3'
      }
    }
  } else if (config.service === 'custom') {
    transportConfig = {
      ...transportConfig,
      host: config.host,
      port: config.port,
      secure: config.secure
    }
  }

  return nodemailer.createTransport(transportConfig)
}

export async function sendEmail(smtp, mailOptions) {
  const transporter = createTransporter(smtp)
  return await transporter.sendMail(mailOptions)
}

export async function verifyConnection(smtp) {
  const transporter = createTransporter(smtp)
  return await transporter.verify()
}