import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
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

    const [bearer, token] = authHeader.split(" ")

    if (bearer !== "Bearer" || !token) {
      throw new AppError("Invalid token format. Use: Bearer <token>", 401)
    }

    const {role, sub: user_id} = jwt.verify(String(token), authConfig.jwt.secret)  as JwtPayload

    request.user = {
      id: user_id,
      role,
    }

    return next()

  } catch (error) {
    if (error instanceof AppError) {
      return next(error)
    }
    if (error instanceof Error && error.name === "TokenExpiredError") {
      return next(new AppError("JWT token expired", 401))
    }
    if (error instanceof Error && error.name === "JsonWebTokenError") {
      return next(new AppError("Invalid JWT token", 401))
    }
    return next(new AppError("Invalid JWT token", 401))
  }
}

export { EnsureAuthenticated }
