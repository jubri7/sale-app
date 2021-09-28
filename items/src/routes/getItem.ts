import { BadRequestError } from "@jugitix/common";
import express, { Response, Request, NextFunction } from "express";
import { Item } from "../models/Item";

const router = express.Router();

router.get(
  "/api/items/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await Item.findById(req.params.id);
      if (!item) throw new BadRequestError("Item not found");
      res.send(item);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getItemRouter };
