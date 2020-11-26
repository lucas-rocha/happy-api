import { Request, Response, NextFunction } from 'express'
import authService from '@services/auth.service'

export const isAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization: string | undefined = req.headers.authorization

  if (!authorization) {
    return res.status(401).json({ message: 'No token provided.' })
  }

  const parts: string[] = authorization.split(' ')

  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token error.' })
  }

  const [scheme, token] = parts

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token malformatted.' })
  }

  return authService.verifyToken(token, (err, thisToken) => {
    if (err) {
      return res.status(401).json({ err })
    }
    return next()
  })
}
