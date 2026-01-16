import express from "express"
import { ErrorHandling } from "./middlewares/error-handling.js"
import { route } from "./routes/index.js"

import swaggerUi from 'swagger-ui-express'
import { swaggerSpec } from "./config/swagger.js"

const app = express()

app.use(express.json())
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use(route)
app.use(ErrorHandling)

export { app }

