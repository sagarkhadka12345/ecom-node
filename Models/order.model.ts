import { getModelForClass, mongoose, prop } from "@typegoose/typegoose";
import crypto from "crypto";
import { Item } from "./item.model";
import { User } from "./user.model";

export class Order {
  @prop({ required: true, default: crypto.randomBytes(12).toString("hex") })
  orderId: string;
  @prop({ required: true })
  username: User["username"];
  @prop({})
  items: [Item];
  @prop({ required: true, default: Date.now() })
  date: string;
  @prop({ required: true })
  totalPrice: number;
}

export const OrderModel = getModelForClass(Order);
