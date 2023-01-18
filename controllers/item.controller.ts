import express, { NextFunction, Request, Response } from "express";
import { ItemModel, newItemBody } from "../Models/item.model";
import mongoose from "mongoose";
import { findItemsBySellerService } from "../service/item.service";
import { findItemsByTypeService } from "../service/item.service";

export const createItemHandler = async (
  req: Request<{}, {}, newItemBody>,
  res: Response
) => {
  const { seller, name, price, type } = req.body;

  const Item = await ItemModel.create({
    _id: new mongoose.Types.ObjectId(),
    seller,
    name,
    price,
    type,
    img: req.file?.filename !== undefined ? req.file?.filename : "",
  });

  return Item.save()
    .then((Item) => {
      res.status(200).send(Item);
    })
    .catch((err: any) => {
      res.status(400).send(err);
    });
};
export const deleteItemhandler = async (req: Request, res: Response) => {
  await ItemModel.findOneAndDelete({ productId: req.params.itemId });
  return res.status(200).send("Product deleted");
};

export const findAllItems = async (req: Request, res: Response) => {
  const item = await ItemModel.find();

  return res.status(200).send(item);
};
export const findItem = async (req: Request, res: Response) => {
  const { itemId } = req.params;
  const item = await ItemModel.find({
    _id: itemId,
  });
  return res.status(200).send(item);
};

export const findItemsBySeller = async (req: Request, res: Response) => {
  const { seller } = req.params;
  const item = await findItemsBySellerService(seller);
  return res.status(200).send(item);
};

export const findItemsByType = async (req: Request, res: Response) => {
  const { typeId } = req.params;
  const item = await findItemsByTypeService(typeId);
  return res.status(200).send(item);
};
