import { Router } from 'express'
import { usersRoute } from './users.routes.js'

const route = Router()

route.use("/users", usersRoute)

export { route }
