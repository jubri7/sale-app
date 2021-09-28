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
    let amount = 0;
    const itemList = [];
    try {
      for (let itemId of req.body.items) {
        const item = await Item.findById(itemId);
        if (!item) throw new NotFoundError();
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

      res.send(payment);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newChargeRouter };
