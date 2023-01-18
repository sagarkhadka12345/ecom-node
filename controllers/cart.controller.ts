import { Request, Response } from "express";
import { Cart, CartModel } from "../Models/cart.model";

import mongoose from "mongoose";
import logger from "../logger/logger";
import {
  updateCartService,
  findCartService,
  emptyCartService,
  removeItemService,
} from "../service/cart.service";
import { UserModel } from "../Models/user.model";

export async function findAll(req: Request, res: Response) {
  const Cart = await CartModel.find();
  return res.send(Cart).status(200);
}

export const updateCartHandler = async (req: Request, res: Response) => {
  const { username, item } = req.body;
  const carts = await updateCartService(username, item);
  return res.send(carts).status(200);
};

export const createCartHandler = async (req: Request, res: Response) => {
  const { username, totalQty, totalPrice, items } = req.body;

  const Cart = await CartModel.create({
    _id: new mongoose.Types.ObjectId(),
    username,
    items,
    totalQty,
    totalPrice,
  });

  return Cart.save().catch((err: any) => {
    if ((err.status = 11000)) {
      return res.send("user already").status(400);
    }
    console.log(err);

    res.status(500).send(err);
  });
};

export const emptyCartHandler = async (req: Request, res: Response) => {
  const { username, items } = req.body;

  if ((items as any[]).length === 0) {
    return res.send("Error").status(400);
  }
  const cart = await emptyCartService(username);
  return res.status(200).send("Cart deleted successful");
};
export const findCart = async (req: Request, res: Response) => {
  const { username } = req.body;

  const Carts = await findCartService(username);
 
  return res.send(Carts).status(200);
};
export const removeItemHandler = async (req: Request, res: Response) => {
  const { productId, username } = req.body;
  const cart = await findCartService(username);
  if (cart) {
    const carts = await removeItemService(username, productId);
    return res.send(carts).status(200);
  }
  res.send(500);
};

// export const deleteItemHandler= async(req:Request, res:Response)=>{
//   const {username}= req.body;
//   const cart = await findCartService(username);
//   const carts = CartModel.updateOne({
//     username
//   },{
//     $pull:{

//     }
//   })
// }
