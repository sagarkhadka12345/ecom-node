import { Cart, CartModel } from "../Models/cart.model";
import { Item } from "../Models/item.model";
import { User, UserModel } from "../Models/user.model";

export async function updateCartService(
  username: User["username"],
  item: object
) {
  return await CartModel.updateOne(
    {
      username,
    },
    {
      $push: {
        items: item,
      },
    }
  );
}
export async function findCartService(username: Cart["username"]) {
  return await CartModel.find({
    username,
  });
}
export async function emptyCartService(username: User["username"]) {
  return await CartModel.updateOne(
    {
      username,
    },
    {
      $set: {
        items: [],
      },
    }
  );
}

export function removeItemService(
  username: Cart["username"],
  productId: Item["productId"]
) {
  return CartModel.updateOne(
    {
      username,
    },
    {
      $pull: {
        items: { productId: productId },
      },
    }
  );
}
