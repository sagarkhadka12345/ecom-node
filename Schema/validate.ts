import { AnyZodObject } from "zod";
import { NextFunction, Request, Response } from "express";

type TValidationType = "BODY" | "Params";
type TValidationTypeGet = "BODY";
export const validate =
  (
    ...args: {
      schema: AnyZodObject;
      typeOfReq: TValidationType;
    }[]
  ) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      for (let i = 0; i < args.length; i++) {
        if (args[i].typeOfReq === "BODY") {
          await args[i].schema.parseAsync(req.body);
        } else {
          await args[i].schema.parseAsync(req.params);
        }
      }
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };
