import { AppError } from "../utils/AppError.js"
import type { Request, Response, NextFunction } from "express"
import { ZodError } from 'zod'

export function ErrorHandling(err: any, req: Request, res: Response, next: NextFunction) {

  if (err instanceof AppError) {
    return res.status(err.statuscode).json({ message: err.message })
  }

  if(err instanceof ZodError) {
    return res.status(400).json({message: "erro de validação", issues: err.format})
  }
  return res.status(500).json({ message: "Erro no servidor" })
}
