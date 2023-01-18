import mongoose from "mongoose"
import config from "../config/config"
import logger from "../logger/logger"
const localhost = "mongodb://127.0.0.1/ecommerce"


export  const  db = mongoose.connect(config.mongo.url, {retryWrites:true, w:"majority"}).then(
    ()=>{
        logger.info("connected to DataBase")
    }
).catch(
    (err)=>{
        logger.error(err)
    }
)
