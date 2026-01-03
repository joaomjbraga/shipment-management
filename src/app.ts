import express from "express"
import { ErrorHandling } from "./middlewares/error-handling.js"
import { route } from "./routes/index.js"

const app = express()

app.use(express.json())
app.use(route)
app.use(ErrorHandling)

export { app }

