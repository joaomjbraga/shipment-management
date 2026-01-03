import { Router} from "express"
import { UserControlles } from "../controllers/users-controlles.js"

const usersRoute = Router()
const userController = new UserControlles()

usersRoute.get("/", userController.Index)
usersRoute.post("/", userController.Create)
usersRoute.put("/:id", userController.Upgrade)
usersRoute.delete("/", userController.Delete)


export { usersRoute }
