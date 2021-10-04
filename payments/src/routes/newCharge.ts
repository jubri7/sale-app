import { BadRequestError, validateRequest } from "@jugitix/common";
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
  [body("token").notEmpty(), body("items").notEmpty()],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      let money: number = 0.0;
      const idList = [];
      for (const listItem of req.body.items) {
        const item = await Item.findById(listItem.id);
        if (!item) throw new BadRequestError(`Item not found`);
        idList.push(item.id);
        money += item.price;
      }
      const charge = await stripe.charges.create({
        currency: "usd",
        amount: money * 100,
        source: req.body.token.id,
      });
      const payment = Payment.build({
        items: idList,
        stripeId: charge.id,
      });
      await payment.save();
      new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        items: idList,
        stripeId: charge.id,
        userId: req.currentUser ? req.currentUser.id : req.body.token.email,
      });
      for (let id of idList) {
        await Item.findByIdAndDelete(id);
      }
      res.send(payment);
    } catch (error) {
      next(error);
    }
  }
);

export { router as newChargeRouter };
