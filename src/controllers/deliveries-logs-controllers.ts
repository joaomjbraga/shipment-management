import type { Request, Response } from "express"
import z from 'zod'
import { AppError } from "@/utils/AppError.js"
import { prisma } from "@/utils/prisma.js"

class DeliveriesLogsController {

 async create ( request: Request, response: Response) {

  const bodyschema = z.object({
    delivery_id: z.string().uuid(),
    description: z.string()
  })
  const { delivery_id, description} = bodyschema.parse(request.body)

  const deliveries = await prisma.delivery.findUnique({
    where: {id: delivery_id}
  })

  if(!deliveries) {
    throw new AppError("delivery not found", 404)
  }

  if(deliveries.status === "delivered") {
    throw new AppError("this order has already been delivered", )
  }

  if(deliveries.status === "processing") {
    throw new AppError("change status to shipped")
  }


  await prisma.deliveryLog.create({
    data: {
      deliveryId: delivery_id,
      description
    }
  })

  return response.status(201).json()
  }

async Show ( request: Request, response: Response ) {
  const parmsschema = z.object({
    deliveries_id: z.string().uuid(),
  })
  const { deliveries_id } = parmsschema.parse(request.params)

  const delivery = await prisma.delivery.findUnique({
    where: {
      id: deliveries_id
    }, select: {
     id: true,
    userID: true,
    description:true,
    status: true,
    createdAt: true,
    updateAt: true,
    logs: true

    }
  })

  if(request.user?.role === "customer" && request.user.id !== delivery?.userID) {
    throw new AppError("the user can only view thier deliveries", 401)
  }

  return response.json(delivery)
}
}

export { DeliveriesLogsController }
