import { Request, Response } from "express";
import { User, UserModel } from "../Models/user.model";
import bcrypt from "bcrypt";
import { db } from "../DataBase/dataBase";
import { ItemModel } from "../Models/item.model";

export async function findUserService(username: User["username"]) {
  return await UserModel.findOne({
    username,
  });
}

export async function changePasswordService(
  username: User["username"],
  password: User["password"],
  newPassword: User["password"]
) {
  return UserModel.updateOne(
    {
      username,
    },
    {
      $set: {
        password: await bcrypt.hash(newPassword, 10),
      },
    }
  );
}
export async function forgotPasswordService(
  username: User["username"],
  token: User["resetPassword"]
) {
  return UserModel.updateOne(
    {
      username,
    },
    {
      $set: {
        resetPassword: token,
      },
    }
  );
}
export async function resetPasswordService(
  username: User["username"],
  newToken: User["resetPassword"],
  password: User["password"]
) {
  return UserModel.updateOne(
    {
      username,
    },
    {
      $set: {
        password: password,
        resetPassword: newToken,
      },
    }
  );
}

export const addItemsService = async (req: Request, res: Response) => {
  const { itemId } = req.body;
  const item = await addItems(itemId);

  return res.status(200).send(item);
};

export async function addItems(data: []) {
  return await ItemModel.insertMany(data);
}
