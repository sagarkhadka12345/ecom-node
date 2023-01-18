import dotenv from "dotenv";
dotenv.config();

const jwt_secret = process.env.ACCESS_TOKEN_SECRET || "";

const SERVER_PORT = process.env.PORT || 9494;
const MONGO_USERNAME = process.env.MONGO_USERNAME || "";
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || "";
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.rsh6s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const config = {
  mongo: {
    url: MONGO_URL,
    password: MONGO_PASSWORD,
  },
  server: {
    port: SERVER_PORT,
  },
  access: {
    secret: jwt_secret,
  },
  mail: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
};

export default config;
