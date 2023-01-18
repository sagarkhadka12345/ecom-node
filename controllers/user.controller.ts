import express, { NextFunction, Request, Response } from "express";
import { LoginType, UserModel } from "../Models/user.model";
import mongoose from "mongoose";
import { RegisterUserBody, registerUserSchema } from "../Models/user.model";
import dotenv from "dotenv";
import * as bcrypt from "bcrypt";
import {
  changePasswordService,
  findUserService,
  resetPasswordService,
} from "../service/user.service";
import crypto from "crypto";
import { sendMail } from "../helpers/mailer";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { object } from "zod";

dotenv.config();

export const createUserHandler = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response
) => {
  const { firstname, lastname, email, password, username, address } = req.body;

  const user = await UserModel.create({
    _id: new mongoose.Types.ObjectId(),
    email,
    password,
    username,
    address,
    firstname,
    lastname,
  });
  return user
    .save()
    .then(() => {
      const token = jwt.sign({ username: username }, config.access.secret);
      return res.status(200).send(token);
    })
    .catch((err: any) => {
      console.log(err);

      if (err.code === 11000) {
        return res.send("User already created");
      }
      return res.send(err.message).status(200);
    });
};
export const loginUser = async (
  req: Request<{}, {}, LoginType>,
  res: Response
) => {
  const { username, password } = req.body;
  console.log("====================================");
  console.log(req.body);
  console.log("====================================");
  const user = await findUserService(username);
  console.log("====================================");
  console.log(user);
  console.log("====================================");
  if (
    user &&
    Object.entries(user).length !== 0 &&
    (await user.comparePassword(password))
  ) {
    const token = jwt.sign({ username: username }, config.access.secret);

    return res.status(200).send(token);
  }

  return res.status(500).send("Invalid email or password");
};

export const findAllUsers = async (req: Request, res: Response) => {
  const item = await UserModel.find();
  return res.status(200).send(item);
};

export const changePassword = async (req: Request, res: Response) => {
  const { username, password, newPassword } = req.body;
  const user = await findUserService(username);
  if (user && (await user.comparePassword(password))) {
    await changePasswordService(username, password, newPassword);
    return res.status(200).send(user);
  }
  return res.status(500).send("Invalid email or password");
};
export const forgotPassword = async (req: Request, res: Response) => {
  const { username } = req.body;
  const user = await UserModel.findOne({ username });
  if (!user) {
    return res.send("User doesn't exist");
  }
  const token = crypto.randomBytes(12).toString("hex");

  const update = await UserModel.updateOne(
    {
      username,
    },
    {
      $set: {
        resetPassword: token,
      },
    }
  );
  await sendMail({
    from: "sagar.khadka2001@mail.com",
    to: "sagar.khadka2001@gmail.com",
    subject: "Forgot Password",
    html: `<a href='${token}'<button>Reset Password</button>`,
  });
  return res.status(200).send(token);
};
export const resetPassword = async (req: Request, res: Response) => {
  const { username, password, token } = req.body;
  const user = await findUserService(username);
  const newToken = crypto.randomBytes(12).toString("hex");
  const hash = await bcrypt.hash(password, 10);
  if (user && user.compareToken(token)) {
    await resetPasswordService(username, newToken, hash);
    return res.status(200).redirect("http://localhost:3001");
  }
  return res.status(404).send("user not found");
};

export const findUser = async (req: Request, res: Response) => {
  const { username } = req.body.username;
  try {
    const result = await findUserService(username);
    res.send(req.body).status(200);
  } catch (error) {
    res.status(400).send(error);
  }
};
