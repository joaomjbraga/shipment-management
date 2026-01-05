import type { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"
import { AppError } from "@/utils/AppError.js"
import { authConfig } from "@/config/auth.js"

interface JwtPayload {
  role: string
  sub: string
}

async function EnsureAuthenticated(request:Request, response:Response, next:NextFunction) {
  try {
    const authHeader = request.headers.authorization

    if(!authHeader) {
      throw new AppError("JWT token not found", 401)
    }

    const [, token] = authHeader.split(" ")
    console.log(token)

    const {role, sub: user_id} = verify(String(token), authConfig.jwt.secret)  as JwtPayload

    request.user = {
      id: user_id,
      role,
    }

  } catch (error) {
    throw new AppError("Invalid JWT token", 401)
  }
}
