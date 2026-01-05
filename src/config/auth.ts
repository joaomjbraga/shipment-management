import type { SignOptions } from "jsonwebtoken"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined")
}

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET,
    options: {
      expiresIn: "1d",
    } satisfies SignOptions,
  },
} as const
