import { Router } from 'express'
import { usersRoute } from './users.routes.js'
import { sessionRout } from './sessions.routes.js'

const route = Router()

route.use("/sessions", sessionRout)
route.use("/users", usersRoute)
export { route }
