import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config/config";

interface JwtTokenSeller {
  username: string;
  iat: string;
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (token == null) {
    return res.status(400);
  }
  try {
    const { username } = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as unknown as JwtTokenSeller;
    req.body.username = username;
    next();
  } catch {
    return res.send(404).redirect("/login");
  }
}

export function authenticateTokenSeller(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeaders = req.headers["authorization"];
  const token = authHeaders && authHeaders.split(" ")[1];
  if (token == null) {
    return res.status(400);
  }
  try {
    const { username } = jwt.verify(
      token,
      config.access.secret as string
    ) as unknown as JwtTokenSeller;
    req.body.seller = username;
 

    next();
  } catch {
    return res.status(406).send("Please login or register");
  }
}
