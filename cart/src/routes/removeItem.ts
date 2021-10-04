import express, { Request, Response, NextFunction, response } from "express";
import { Cart } from "../models/Cart";
import { Item } from "../models/Item";
import { NotFoundError, requireAuth } from "@jugitix/common";
const router = express.Router();

router.delete(
  "/api/cart/:id",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cart = await Cart.findOne({ userId: req.currentUser?.id });

      if (!cart) throw new NotFoundError();

      cart.items = cart.items.filter((id) => String(id) != req.params.id);
      await cart.save();

      res.send(cart);
    } catch (error) {
      next(error);
    }
  }
);

export { router as removeItemRouter };
