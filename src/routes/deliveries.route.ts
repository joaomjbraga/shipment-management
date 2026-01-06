import { Router } from "express"
import { DeliveryController } from "@/controllers/deliveries-controllers.js"
import { EnsureAuthenticated } from "@/middlewares/ensure-authenticated.js"
import { verifyAuthorization } from "@/middlewares/verifyUserAuthorization.js"
import { DeliveriesStatusController } from "@/controllers/deliveries-status-controllers.js"

export const deliveryRoutes = Router()
const deliveryController = new DeliveryController()
const deliverStatusController = new DeliveriesStatusController()

deliveryRoutes.use( EnsureAuthenticated,verifyAuthorization(["sale"]) )

deliveryRoutes.post("/", deliveryController.Create)
deliveryRoutes.get("/", deliveryController.Index)
deliveryRoutes.patch("/:id/status", deliverStatusController.Update)
