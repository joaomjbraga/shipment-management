import { env } from "@/env/index.js"
import type { SignOptions } from "jsonwebtoken"

export const authConfig = {
  jwt: {
    secret: env.JWT_SECRET,
    options: {
      expiresIn: "1d",
    } satisfies SignOptions,
  },
} as const
