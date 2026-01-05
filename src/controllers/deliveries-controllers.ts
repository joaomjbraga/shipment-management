import type { Request, Response, NextFunction } from "express"

export class DeliveryController {

  async Create(request: Request, response:Response, next: NextFunction) {
    return response.status(201).json({message: "rota criada"})
  }
}
