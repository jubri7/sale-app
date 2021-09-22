import {
  BadRequestError,
  NotAuthorizeError,
  NotFoundError,
  requireAuth,
} from "@jugitix/common";
import express, { Response, Request, NextFunction } from "express";
import { Item } from "../models/Item";

const router = express.Router();

router.delete(
  "/api/items",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await Item.findByIdAndDelete(req.body.itemId);
      if (!item) throw new BadRequestError("Item not found");
      if (item.userId !== req.currentUser?.id) throw new NotAuthorizeError();
      res.send(item);
    } catch (error) {
      next(error);
    }
  }
);

export { router as deleteItemRouter };
