import { OrderModel, Order } from "../Models/order.model";
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import {
  findOrderServiceByUsername,
  pushItemsService,
} from "../service/order.service";
import crypto from "crypto";
export const createOrderHandler = async (req: Request, res: Response) => {
  const { username, items, totalPrice } = req.body;
  console.log("====================================");
  console.log("Here");
  console.log("====================================");
  console.log("====================================");

  const orderId = crypto.randomBytes(12).toString("hex");
  
  const Cart = await OrderModel.create({
    _id: new mongoose.Types.ObjectId(),
    orderId,
    username,
    items,
    totalPrice,
  });

  return Cart.save()
    .then((Cart) => {
      res.status(200).send(Cart);
    })
    .catch((err: any) => {
      res.status(500).send(err);
    });
};
export const findOrderByUsername = async (req: Request, res: Response) => {
  const { username } = req.params;
  const orders = await findOrderServiceByUsername(username);
  return res.send(orders).status(200);
};

export const pushItems = async (req: Request, res: Response) => {
  const { username, item } = req.body;
  const order = pushItemsService(username, item);
  return res.send(order);
};

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const resp = await OrderModel.find();
    res.status(200).send(resp);
  } catch (error) {
    res.status(400).send("Error while fetching Order");
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    await OrderModel.deleteOne({
      orderId: req.params.orderId,
    });
    res.status(200).send("Order Deletion successful");
  } catch (error) {
    res.status(400).send("Order Deletion Error");
  }
};
