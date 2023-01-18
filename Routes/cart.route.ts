import { createCartHandler, updateCartHandler } from "../controllers/cart.controller";
import express, {Router} from "express";


const router = express.Router()

router.post("/createCart", createCartHandler)

router.patch("/:username", updateCartHandler)


export default Router;