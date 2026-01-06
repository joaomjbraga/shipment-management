import { Router } from 'express'
import { usersRoute } from './users.routes.js'
import { sessionRout } from './sessions.routes.js'
import { deliveryRoutes } from './deliveries.route.js'
import { deliverieslogRoute } from './deliveries.logs.route.js'

const route = Router()

route.use("/sessions", sessionRout)
route.use("/users", usersRoute)
route.use("/deliveries", deliveryRoutes)
route.use("/deliveries-logs", deliverieslogRoute)
export { route }
