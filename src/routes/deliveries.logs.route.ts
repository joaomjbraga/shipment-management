import { Router } from "express"
import { DeliveriesLogsController } from "@/controllers/deliveries-logs-controllers.js"
import { EnsureAuthenticated } from "@/middlewares/ensure-authenticated.js"
import { verifyAuthorization } from "@/middlewares/verifyUserAuthorization.js"


const deliverieslogRoute = Router()
const deliveriesController = new DeliveriesLogsController()

deliverieslogRoute.post("/", EnsureAuthenticated, verifyAuthorization(["sale"]), deliveriesController.create)

deliverieslogRoute.get("/:deliveries_id/show", EnsureAuthenticated, verifyAuthorization(["sale", "customer"]), deliveriesController.Show)


export { deliverieslogRoute }


