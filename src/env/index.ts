import 'dotenv/config'
import {z} from 'zod'

const envschema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string()
})

export const env = envschema.parse(process.env)
