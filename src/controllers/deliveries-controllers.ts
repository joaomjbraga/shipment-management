import type { Request, Response, NextFunction } from "express"
import { prisma } from "@/utils/prisma.js"
import { AppError } from "@/utils/AppError.js"
import z from 'zod'

export class DeliveryController {

  async Create(request: Request, response:Response, next: NextFunction) {
    try {
      const bodyschema = z.object({
        user_id: z.string().uuid(),
        description: z.string().min(1, "Description cannot be empty")
      })

      const { user_id, description } = bodyschema.parse(request.body)

      const userExists = await prisma.users.findUnique({
        where: { id: user_id }
      })

      if (!userExists) {
        throw new AppError("User not found", 404)
      }

      if (request.user?.role === "customer" && request.user.id !== user_id) {
        throw new AppError("You can only create deliveries for yourself", 403)
      }

      const delivery = await prisma.delivery.create({
        data: {
          userID: user_id,
          description
        }
      })

      return response.status(201).json(delivery)
    } catch (error) {
      return next(error)
    }
  }

  async Index(request: Request, response:Response, next: NextFunction) {
    const deliveries = await prisma.delivery.findMany({
      select: {
        id: true,
        userID: true,
        description: true,
        status: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
        createdAt: true,
        updateAt: true
      }
    })
    return response.status(200).json(deliveries)
  }
}
