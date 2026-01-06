import type { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/AppError.js"

function verifyAuthorization (role: string[]) {
  return ( request: Request, response: Response, next: NextFunction) => {
    try {
      if (!request.user) {
        throw new AppError("Unauthorized", 401)
      }

      if ( !role.includes(request.user.role)) {
        throw new AppError("Unauthorized", 401)
      }
      return next()
    } catch (error) {
      return next(error)
    }
  }
}

export { verifyAuthorization }
