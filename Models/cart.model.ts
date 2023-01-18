import { getModelForClass, prop, Ref } from "@typegoose/typegoose"
import { Item } from "./item.model"
import { User } from "./user.model"


export class Cart {


    @prop({required:true})
    username: string
    @prop({})
    items:[Ref<Item>]
    @prop({required:true, default:Date.now})
    modifiedTime:Date
    @prop({required:true, default:0})
    totalQty:number
    @prop({required:true, default:0})
    totalPrice:number

   
}

export const CartModel = getModelForClass(Cart,{
    schemaOptions:{
        timestamps:true
    }
})