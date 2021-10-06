import { BadRequestError } from "@jugitix/common";
import express, { Response, Request, NextFunction } from "express";
import { Item } from "../models/Item";
import { redisClient } from "../redis";
const router = express.Router();

router.get(
  "/api/items/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cachedItem = await redisClient.read(req.params.id);
      if (cachedItem) return res.send(JSON.parse(cachedItem));

      const item = await Item.findById(req.params.id);
      if (!item) throw new BadRequestError("Item not found");
      redisClient.write(req.params.id, JSON.stringify(item));
      res.send(item);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getItemRouter };
