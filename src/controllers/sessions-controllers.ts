import type { Request, Response, NextFunction } from 'express'
import z from "zod"
import { prisma } from '@/utils/prisma.js'
import { AppError } from '@/utils/AppError.js'
import { compare } from 'bcrypt'
import { authConfig } from '@/config/auth.js'
import jwt from 'jsonwebtoken'

class SessionsController {
  async SessionLogin (request: Request, response: Response, next: NextFunction) {
    try {

      const bodyschema = z.object({
        email: z.string().email("Invalid email format"),
        password: z.string().min(1, "Password is required")
      })

      const {email, password} = bodyschema.parse(request.body)

      const user = await prisma.users.findFirst({where: { email } })

      if(!user) {
        throw new AppError("Invalid email or password.", 401)
      }

      const passwordMatched = await compare(password, user.password)

      if( !passwordMatched) {
        throw new AppError("Invalid email or password.", 401)
      }

      const {secret, options } = authConfig.jwt

      const token = jwt.sign(
        {role: user.role ?? "customer"},
        secret,
        {
          ...options,
          subject: user.id
        }
      )
      const {password: hashedPassword, ...userWithoutPassword} = user

      return response.json({token, user : userWithoutPassword})

    } catch (error) {
      next(error)
    }
  }
}

export { SessionsController }
