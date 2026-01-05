import { Router } from "express"
import { DeliveryController } from "@/controllers/deliveries-controllers.js"
import { EnsureAuthenticated } from "@/middlewares/ensure-authenticated.js"
import { verifyAuthorization } from "@/middlewares/verifyUserAuthorization.js"

export const deliveryRoutes = Router()
const deliveryController = new DeliveryController()

deliveryRoutes.use(EnsureAuthenticated, verifyAuthorization(["sale"]))
deliveryRoutes.post("/", deliveryController.Create)
