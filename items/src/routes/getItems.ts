import { ItemStatus } from "@jugitix/common";
import express, { Response, Request, NextFunction } from "express";
import { Item } from "../models/Item";

const router = express.Router();

router.get(
  "/api/items",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const items = await Item.find({ status: ItemStatus.AwaitingPayment });
      res.send(items);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getItemsRouter };
