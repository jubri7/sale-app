import express, { Request, Response, NextFunction } from "express";
import { BadRequestError, requireAuth } from "@jugitix/common";
import { Cart } from "../models/Cart";
const router = express.Router();

router.get(
  "/api/cart",
  requireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cart = await Cart.findOne({ userId: req.currentUser!.id }).populate(
        "items"
      );
      if (!cart) throw new BadRequestError("Cart not found");

      res.send(cart);
    } catch (error) {
      next(error);
    }
  }
);

export { router as getItemsRouter };
