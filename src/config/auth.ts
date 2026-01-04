import type { SignOptions } from 'jsonwebtoken'

export const authConfig = {
  jwt: {
    secret: process.env.JWT_SECRET as string,
    options: {
      expiresIn: "1d",
    } satisfies SignOptions
  }
}
