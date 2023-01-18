import { Item, ItemModel } from "../Models/item.model";

export function findItemsBySellerService(seller: Item["seller"]) {
    return ItemModel.find({
        seller
    })
}

export function findItemsByTypeService(type : Item["type"]){
    return ItemModel.find({
        type
    })
}