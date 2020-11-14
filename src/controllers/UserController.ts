import { Request, Response } from 'express'
import User from '@models/User'
import { getRepository } from 'typeorm'
import AuthService from '@services/auth.service'

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
  }

}
