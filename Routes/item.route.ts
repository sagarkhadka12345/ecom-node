import { createItemHandler, findAllItems, findItem, findItemsBySeller, findItemsByType } from "../controllers/item.controller"
import express from "express"
import { Router } from "express"


const router = express.Router()
router.get("/:itemId", findItem )
router.get("/findAll", findAllItems)
router.get("/type/:typeId", findItemsByType)
router.get("/seller/:sellerId", findItemsBySeller)
router.post("/createItem", createItemHandler)
export default Router;