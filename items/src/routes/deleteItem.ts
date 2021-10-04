import {
  BadRequestError,
  NotAuthorizeError,
  requireAuth,
} from "@jugitix/common";
import express, { Response, Request, NextFunction } from "express";
import { ItemRemovedPublisher } from "../events/publisher/itemRemovePublisher";
import { Item } from "../models/Item";
import { redisClient } from "../redis";
import { natsWrapper } from "../stan";

const router = express.Router();

router.delete(
  "/api/items",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await Item.findByIdAndDelete(req.body.itemId);
      if (!item) throw new BadRequestError("Item not found");
      if (item.userId !== req.currentUser?.id) throw new NotAuthorizeError();
      new ItemRemovedPublisher(natsWrapper.client).publish({
        id: item.id,
      });
      redisClient.client.del(item.id);
      redisClient.client.del("items");
      res.send(item);
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteItemRouter };
