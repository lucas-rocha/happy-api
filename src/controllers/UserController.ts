import { Request, Response } from 'express'
import User from '@models/User'
import { getRepository } from 'typeorm'
import AuthService from '@services/auth.service'
import crypto from 'crypto'
import { transporter } from '@config/mail'

export default {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body

    try {
      const user = await getRepository(User).findOne({ email })

      if (user) {
        return res.status(409).json({ message: 'User already exits' })
      }

      const newPassword = await AuthService.hashPassword(password)

      const newUser = getRepository(User).create({
        name,
        email,
        password: newPassword
      })
      await getRepository(User).save(newUser)

      return res.status(201).json(newUser)
    } catch (err) {
      return res.status(500).json({ message: 'erro' })
    }
  },

  async authenticate(req: Request, res: Response) {
    const { email, password } = req.body

    try {
      const user = await getRepository(User).findOne({ email })

      if (!user) {
        return res.status(401).json({ message: 'User not found!' })
      }

      if (!(await AuthService.comparePasswords(password, user.password))) {
        return res.status(401).json({ message: 'Password does not match!' })
      }

      const token = await AuthService.generateToken({ id: String(user.id) })

      return res.json({ token })
    } catch (err) {
      return res.status(500).json({ message: err.message })
    }
  },

  async forgetPassword(req: Request, res: Response) {
    const { email } = req.body

    const userRepository = getRepository(User)
    const user = await userRepository.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: 'User not found!' })
    }

    const token = crypto.randomBytes(20).toString('hex')
    const now = new Date()
    now.setHours(now.getHours() + 1)

    user.reset_password_token = token
    user.reset_password_date_expires = now

    await userRepository.save(user)

    transporter.sendMail({
      from: 'some-email@mail.com',
      to: email,
      subject: 'password recovery',
      html: `<p>Did you forget your password? Please reset by clicking the link below: </p>
        <a href=${'example.com' + '/forget_password/' + token}>Click here!</a>`
    }, (err) => {
      if (err) return res.status(401).json({ message: 'It was not possible to send the email.' })

      res.status(200).json({ message: 'E-mail sent successfully.' })
    })
  },

  async verifyForgetPasswordToken(req: Request, res: Response) {
    const { token } = req.params

    if (!token) {
      return res.status(400).json({ message: 'No token provided.' })
    }

    try {
      const usersRepository = getRepository(User)
      const user = await usersRepository.findOne({ reset_password_token: token })

      if (!user) {
        return res.status(400).json({ message: 'Token incorrect.' })
      }

      const now = new Date()
      const reset_password_date = new Date(user.reset_password_date_expires)
      if (reset_password_date < now) {
        res.status(400).json({ message: 'Token has expired.' })
      }

      return res.status(200).json({ email: user.email })
    } catch (err) {
      return res.json({ message: err.message })
    }
  }

}
