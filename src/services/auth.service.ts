import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export default class AuthService {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return bcrypt.hash(password, salt)
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  public static generateToken(payload: object): string {
    return jwt.sign(payload, process.env.SECRET, {
      expiresIn: '1h'
    })
  }

  public static verifyToken(token, cb) {
    return jwt.verify(token, process.env.SECRET, {}, cb)
  }
}
