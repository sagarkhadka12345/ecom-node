import {createUserHandler, findAllUsers, findUser} from "../controllers/user.controller"
import {processRequestBody} from "zod-express-middleware"
import express , { Router} from "express"
import { registerUserSchema } from "../Models/user.model"





const router = express.Router()


router.post("/createuser", createUserHandler)
router.get("/findAllUsers", findAllUsers)
router.get("/findUser", findUser)
export default Router;