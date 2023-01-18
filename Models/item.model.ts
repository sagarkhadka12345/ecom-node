import mongoose from "mongoose";
import { getModelForClass, prop } from "@typegoose/typegoose";
import crypto from "crypto";
import { TypeOf, object, string, number } from "zod";

export const newItemSchema = {
  body: object({
    name: string({
      required_error: "The item must have name ",
    }),
    seller: string({
      required_error: "Seller name must be defined",
    }),
    price: string({
      required_error: "Price must be defined",
      invalid_type_error: "Price must be in number",
    }),
    type: string({
      required_error: "Type must be defined",
    }),
  }).strict(),
};

export type newItemBody = TypeOf<typeof newItemSchema.body>;

export class Item {
  @prop({ required: true })
  name: string;
  @prop({ required: true, default: crypto.randomBytes(12).toString("hex") })
  productId: string;
  @prop({ required: true, default: "unknown" })
  seller: string;
  @prop({ required: true })
  price: number;
  @prop({ required: true })
  type: string;
  @prop({ required: true, default: "img" })
  img: string;
  @prop({ required: true, default: 0 })
  quantity: number;
}

export const ItemModel = getModelForClass(Item);
