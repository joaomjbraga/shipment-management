import type { Request, Response, NextFunction } from 'express'
import z from "zod"
import { prisma } from '@/utils/prisma.js'
import { AppError } from '@/utils/AppError.js'
import { compare } from 'bcrypt'

class SessionsController {
  async SessionLogin (request: Request, response: Response, next: NextFunction) {
    try {

      const bodyschema = z.object({
        email: z.string().email(),
        password: z.string()
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

      return response.json({message: "Acesso Liberado!"})

    } catch (error) {
      next(error)
    }
  }
}

export { SessionsController }
