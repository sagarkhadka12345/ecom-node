import * as nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";
import config from "../config/config";
import logger from "../logger/logger";
import { SMTPClient } from "emailjs";

const mailTransport = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: "sagar.khadka2001@gmail.com",
    pass: "yszrmrrigfzgmzjg",
  },
  port: 445,
  logger: true,
  debug: true,
});
export const sendMail = async (mailOptions: Options) => {
  try {
    const { messageId } = await mailTransport.sendMail({
      ...mailOptions,
    });
    logger.info(mailTransport);
  } catch (error) {
    logger.error(mailTransport);
  }
};
