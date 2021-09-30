import express, { Request, Response, NextFunction } from "express";
import { BadRequestError, requireAuth } from "@jugitix/common";
import { Cart } from "../models/Cart";
import { Item } from "../models/Item";
const router = express.Router();

router.post(
  "/api/cart",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cart = await Cart.findOne({ userId: req.currentUser!.id });
      if (!cart) throw new BadRequestError("Cart not found");

      const item = await Item.findById(req.body.itemId);

      if (!item) throw new BadRequestError("Item not found");

      if (cart.items.includes(item.id))
        throw new BadRequestError("Item already in cart");

      cart.items.push(item.id);
      await cart.save();

      res.send(cart);
    } catch (error) {
      next(error);
    }
  }
);

export { router as addItemRouter };
