import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: 'd684be39790c67',
    pass: 'd26de27b0f7c8a'
  }
})
