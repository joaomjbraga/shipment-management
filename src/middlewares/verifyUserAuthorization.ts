import type { Request, Response, NextFunction } from "express"
import { AppError } from "@/utils/AppError.js"

function verifyAuthorization (role: string[]) {
  return ( request: Request, response: Response, next: NextFunction) => {
    if (!request.user) {
      throw new AppError("Unauthorrized", 401)
    }

    if ( !role.includes(request.user.role)) {
      throw new AppError("Unauthorrized", 401)
    }
    next()
  }
}

export { verifyAuthorization }
