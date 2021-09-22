import {
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
  [body("token").notEmpty(), body("itemId").notEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const item = await Item.findById(req.body.itemId);

      if (!item) throw new NotFoundError();
      if (item.userId != req.currentUser!.id) throw new NotAuthorizeError();

      const charge = await stripe.charges.create({
        currency: "usd",
        amount: item.price * 100,
        source: req.body.token.id,
      });
      const payment = Payment.build({
        itemId: req.body.itemId,
        stripeId: charge.id,
      });
      await payment.save();
      new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        itemId: item.id,
        stripeId: charge.id,
      });

      res.send(payment);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newChargeRouter };
