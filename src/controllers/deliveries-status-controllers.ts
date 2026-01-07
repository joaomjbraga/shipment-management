import type { Request, Response, NextFunction } from "express"
import z from 'zod'
import { prisma } from "@/utils/prisma.js"
import { AppError } from "@/utils/AppError.js"

class DeliveriesStatusController {
  async Update(request: Request, response: Response, next: NextFunction) {
    try {
      const paramsSchema = z.object({
        id: z.string().uuid("ID da entrega deve ser um UUID válido")
      })

      const bodySchema = z.object({
        status: z.enum(["processing", "shipped", "delivered"], {
          message: "Status deve ser um dos valores: processing, shipped ou delivered"
        })
      })

      const { id } = paramsSchema.parse(request.params)

      if (!request.body || typeof request.body !== 'object' || Object.keys(request.body).length === 0) {
        throw new AppError("O corpo da requisição é obrigatório e deve conter o campo 'status'", 400)
      }

      const { status } = bodySchema.parse(request.body)

      const deliveryExists = await prisma.delivery.findUnique({
        where: { id }
      })

      if (!deliveryExists) {
        throw new AppError("Delivery not found", 404)
      }

      const updatedDelivery = await prisma.delivery.update({
        where: { id },
        data: {
          status
        },
        select: {
          id: true,
          userID: true,
          description: true,
          status: true,
          createdAt: true,
          updateAt: true
        }
      })

      await prisma.deliveryLog.create({
        data: {
          deliveryId: id,
          description: status
        }
      })

      return response.status(200).json(updatedDelivery)
    } catch (error) {
      return next(error)
    }
  }
}

export { DeliveriesStatusController }
