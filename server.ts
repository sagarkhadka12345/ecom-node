import { db } from "./DataBase/dataBase";
import express, { Request, Response, NextFunction } from "express";
import config from "./config/config";
import logger from "./logger/logger";
import {
  createItemHandler,
  deleteItemhandler,
  findAllItems,
} from "./controllers/item.controller";
import {
  createCartHandler,
  updateCartHandler,
  findCart,
  removeItemHandler,
  emptyCartHandler,
} from "./controllers/cart.controller";
import {
  createUserHandler,
  findAllUsers,
  loginUser,
  changePassword,
  forgotPassword,
  resetPassword,
  findUser,
} from "./controllers/user.controller";
import { findItem } from "./controllers/item.controller";
import { findItemsBySeller } from "./controllers/item.controller";
import { findItemsByType } from "./controllers/item.controller";
import {
  findOrderByUsername,
  createOrderHandler,
  pushItems,
  getAllOrders,
  deleteOrder,
} from "./controllers/order.controller";
import cors from "cors";
import jwt from "jsonwebtoken";
import {
  authenticateToken,
  authenticateTokenSeller,
} from "./middlewares/authentication";
import { loginBodySchema, registerUserSchema } from "./Models/user.model";
import {
  processRequestBody,
  validateRequestBody,
} from "zod-express-middleware";
import { newItemSchema } from "./Models/item.model";
import path from "path";

import multer from "multer";
import { emptyCartService } from "./service/cart.service";
import { validate } from "./Schema/validate";
const Stripe = require("stripe");
const stripe = Stripe(
  "sk_test_51MA1w7G9ZwN3X5brgRNkQLV1F6sgvTMVrpoMYUvElldIGToP1115fat1mITTFqIn2PMc3LK3V3Z9D4vvwBICokM000S3vgT2YU"
);

db;
const app = express();

const pricesa = async () => {
  try {
    const product = await stripe.products.create({
      name: "Basic Dashboard",
      default_price_data: {
        unit_amount: 1000,
        currency: "usd",
        recurring: { interval: "month" },
      },
      expand: ["default_price"],
    });
    console.log(product);
  } catch (error) {}
};
pricesa();
const endpointSecret =
  "whsec_ed282d6b3d8b224c33fe3e98888caa30bff51adbce6f5d1f944dda09c2bc11f3";

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err: any) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;

        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
  })
);

app.listen(config.server.port, () => {
  logger.info(`Listening to port ${config.server.port} `);
});
app.use((req: Request, res: Response, next: NextFunction) => {
  logger.info(
    `Incoming-> Method: [ ${req.method}] url:[${req.url}] IP: [${req.socket.remoteAddress}]`
  );

  res.on("finish", () => {
    logger.info(
      `Incoming-> Method: [ ${req.method}] url:[${req.url}] IP: [${req.socket.remoteAddress}]  status:[${res.status}]`
    );
  });
  next();
});
//health check
app.get("/ping", (req: Request, res: Response) => {
  res.send("OK").status(200);
  logger.info("api is Healthy");
});

app.post("stripe", async (req: Request, res: Response) => {
  try {
    const session = await stripe.checkout.sessions.create({});
  } catch (error) {}
});

app.use("/api/v1/image/item", express.static("./Assets/Item/"));

app.post("/api/cart/createCart", createCartHandler);
app.post("/api/cart/emptyCart", authenticateToken, emptyCartHandler);
app.get("/api/cart/findCart", authenticateToken, findCart);
app.post("/api/cart/update", authenticateToken, updateCartHandler);
app.post("/api/cart/remove", authenticateToken, removeItemHandler);
app.get("/api/item/findAll", findAllItems);
app.get("/api/item/find/:itemId", findItem);
app.delete("/api/item/delete/:itemId", deleteItemhandler);
app.get("/api/item/type/:typeId", findItemsByType);
app.get("/api/item/seller/:seller", findItemsBySeller);

const storage = multer.diskStorage({
  destination: "./Assets/Item/",
  filename(req, file, callback) {
    let filename =
      file.fieldname +
      Date.now() +
      Math.trunc(Math.random() * 100000) +
      "." +
      file.originalname.split(".")[file.originalname.split(".").length - 1];
    callback(null, filename);
  },
});
const uploadItemPicture = multer({
  storage: storage,
});
app.post(
  "/api/item/createItem",
  uploadItemPicture.single("itemImage"),
  authenticateTokenSeller,
  validate({ schema: newItemSchema.body, typeOfReq: "BODY" }),
  createItemHandler
);
app.post("/api/order/createOrder", authenticateToken, createOrderHandler);
app.get("/api/order/find/:username", findOrderByUsername);
app.post(
  "/api/user/createUser",
  validate({ schema: registerUserSchema.body, typeOfReq: "BODY" }),
  createUserHandler
);
app.get("/api/user/findAllUsers", findAllUsers);
app.get("/api/user/findUser", authenticateToken, findUser);
app.post(
  "/api/user/login",
  validate({ schema: loginBodySchema.body, typeOfReq: "BODY" }),
  loginUser
);
app.post("/api/user/changePassword=", authenticateToken, changePassword);
app.post("/api/user/forgotPassword", forgotPassword);
app.post("/api/user/resetPassword", resetPassword);
app.post("/api/order/pushItems", authenticateToken, pushItems);
app.post("/api/order/createOrder", authenticateToken, createOrderHandler);
app.get("/api/order/getAllOrders", getAllOrders);
app.delete("/api/order/deleteOrder/:orderId", deleteOrder);

app.use(express.static("build"));
app.use("*", (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

app.use("*", (req: Request, res: Response) => {
  return res.send("The Page isn't available in the website");
});
