import { Router } from "express"
import { SessionsController } from "@/controllers/sessions-controllers.js"

const sessionRout = Router()
const sessionsControl = new SessionsController()

sessionRout.post("/", sessionsControl.SessionLogin)

export { sessionRout }
