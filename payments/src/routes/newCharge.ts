import {
  BadRequestError,
  NotAuthorizeError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@jugitix/common";
import express, { Response, Request, NextFunction } from "express";
import { body } from "express-validator";
import { PaymentCreatedPublisher } from "../events/publisher/paymentCreatedPublisher";
import { Item } from "../models/Item";
import { Payment } from "../models/Payment";
import { natsWrapper } from "../stan";
import { stripe } from "../stripe";
const router = express.Router();

router.post(
  "/api/payments",
  requireAuth,
  [body("token").notEmpty(), body("items").notEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    let amount: number = 0;
    const itemList: string[] = [];
    try {
      for (let id of req.body.items) {
        const item = await Item.findById(id);
        if (!item) throw new BadRequestError("Item not found");
        itemList.push(item.id);
        amount += item.price;
      }

      const charge = await stripe.charges.create({
        currency: "usd",
        amount: amount * 100,
        source: req.body.token.id,
      });
      const payment = Payment.build({
        items: itemList,
        stripeId: charge.id,
      });
      await payment.save();
      new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        items: itemList,
        stripeId: charge.id,
      });
      for (let item of itemList) {
        await Item.findByIdAndDelete(item);
      }
      res.send(payment);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newChargeRouter };
