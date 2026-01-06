import type { Request, Response } from "express"
import z from 'zod'
import { AppError } from "@/utils/AppError.js"
import { prisma } from "@/utils/prisma.js"

class DeliveriesLogsController {
 async create ( request: Request, response: Response) {
  return response.json("rota de logs esta rodando normalmente.")
  }
}

export { DeliveriesLogsController }
