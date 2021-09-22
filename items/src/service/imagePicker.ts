import { NotFoundError } from "@jugitix/common";
import express, { Response, Request, NextFunction } from "express";
import { Item } from "../models/Item";
const router = express.Router();

router.get(
  "/api/items/image",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await Item.findById(req.body.itemId);

      if (!item) throw new NotFoundError();
      // @ts-ignore
      res.end(Buffer.from(item.image, "binary"));
    } catch (error) {
      next(error);
    }
  }
);

export { router as imagePicker };
