import type { Request, Response, NextFunction } from 'express'
import z from "zod"
import { hash } from 'bcrypt'
import { prisma } from '@/utils/prisma.js'
import { AppError } from '@/utils/AppError.js'

class UserControlles {

  async Create(request: Request, response: Response, next: NextFunction) {
    try {

      const bodyschema = z.object({
        name: z.string().trim().min(2),
        email: z.string().email(),
        password: z.string().min(6)
      })
      const {name, email, password} = bodyschema.parse(request.body)

      const  userWithSameEmail = await prisma.users.findFirst({where: {email}})

      if (userWithSameEmail) {
        throw new AppError("User with same email already exists")
      }
      const crypt = await hash(password, 8)

      const user = await prisma.users.create({
        data: {
          name,
          email,
          password: crypt
        }
      })

      const {password:_ , ...userWhithoutPassowrk} = user
      return response.status(201).json(userWhithoutPassowrk)

    } catch (error) {
      next(error)
    }
  }

  async Index(request: Request, response: Response, next: NextFunction) {
    try {
      const users = await prisma.users.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updateAt: true
        }
      })
      return response.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  async Upgrade(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid()
      })

      const bodySchema = z.object({
        name: z.string().trim().min(2).optional(),
        email: z.string().email().optional(),
        password: z.string().min(6).optional()
      })

      const { id } = paramsSchema.parse(request.params)
      const data = bodySchema.parse(request.body)

      const userExists = await prisma.users.findUnique({
        where: { id }
      })

      if (!userExists) {
        throw new AppError("User not found", 404)
      }

      if (data.email) {
        const userWithSameEmail = await prisma.users.findFirst({
          where: {
            email: data.email,
            NOT: { id }
          }
        })

        if (userWithSameEmail) {
          throw new AppError("Email already in use")
        }
      }

      const updateData: any = {}

      if (data.name) updateData.name = data.name
      if (data.email) updateData.email = data.email
      if (data.password) updateData.password = await hash(data.password, 8)

      const updatedUser = await prisma.users.update({
        where: { id },
        data: updateData
      })

      const { password: _, ...userWithoutPassword } = updatedUser
      return response.status(200).json(userWithoutPassword)

    } catch (error) {
      next(error)
    }
  }

  async Delete(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid()
      })

      const { id } = paramsSchema.parse(request.params)

      const userExists = await prisma.users.findUnique({
        where: { id }
      })

      if (!userExists) {
        throw new AppError("User not found", 404)
      }

      await prisma.users.delete({
        where: { id }
      })

      return response.status(204).send()

    } catch (error) {
      next(error)
    }
  }
}

export { UserControlles }
