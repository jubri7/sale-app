import { ItemStatus } from "@jugitix/common";
import express, { Response, Request, NextFunction } from "express";
import { Item } from "../models/Item";
import { redisClient } from "../redis";
const router = express.Router();

router.get(
  "/api/items",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cachedItems = await redisClient.read("items");
      if (cachedItems) return res.send(JSON.parse(cachedItems));

      const items = await Item.find({ status: ItemStatus.AwaitingPayment });
      redisClient.write("items", JSON.stringify(items));
      res.send(items);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getItemsRouter };
