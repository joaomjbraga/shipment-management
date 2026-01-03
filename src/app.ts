import express, { type Request, type Response} from "express"
import { ErrorHandling } from "./middlewares/error-handling.js"

const app = express()

app.use(express.json())
app.use(ErrorHandling)

export { app }
