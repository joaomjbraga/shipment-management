import type { Request, Response, NextFunction } from 'express'

class UserControlles {

  async Create(request: Request, response: Response, next: NextFunction) {
    try {
      return response.status(201).json({message: "Create Funcionando!"})
    } catch (error) {
      next(error)
    }
  }

  async Index(request: Request, response: Response, next: NextFunction) {
    return response.status(200).json({message:" Lista de usuarios funcinando!"})
  }


  async Upgrade(request: Request, response: Response, next: NextFunction) {}


  async Delete(request: Request, response: Response, next: NextFunction) {}
}

export { UserControlles }
