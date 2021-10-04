import express, { Request, Response, NextFunction } from "express";
import { BadRequestError, NotFoundError, requireAuth } from "@jugitix/common";
import { Cart } from "../models/Cart";
import { Item } from "../models/Item";
const router = express.Router();

router.get(
  "/api/cart",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cart = await Cart.findOne({ userId: req.currentUser!.id }).populate(
        "items"
      );
      if (!cart) throw new NotFoundError();

      cart.items.filter(async (itemId) => {
        let item = await Item.findById(itemId);
        item ? true : false;
      });
      await cart.save();

      res.send(cart);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getItemsRouter };
