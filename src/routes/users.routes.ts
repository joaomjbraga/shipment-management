import { Router} from "express"
import { UserControlles } from "../controllers/users-controlles.js"
import { EnsureAuthenticated } from "@/middlewares/ensure-authenticated.js"
import { verifyAuthorization } from "@/middlewares/verifyUserAuthorization.js"

const usersRoute = Router()
const userController = new UserControlles()


usersRoute.post("/", userController.Create)

usersRoute.get("/", EnsureAuthenticated, verifyAuthorization(["sale"]), userController.Index)

usersRoute.put("/:id", EnsureAuthenticated, userController.Upgrade)
usersRoute.delete("/:id", EnsureAuthenticated, userController.Delete)


export { usersRoute }
