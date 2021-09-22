import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { stripe } from "../../stripe";
import { Payment } from "../../models/Payment";
import { Item } from "../../models/Item";

jest.mock("../../stripe");

it("returns a 404 when purchasing an order that does not exist", async () => {
  await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin())
    .send({
      token: "asldkfj",
      itemId: mongoose.Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 200 with valid inputs", async () => {
  const userId = mongoose.Types.ObjectId().toHexString();
  const item = Item.build({
    id: mongoose.Types.ObjectId().toHexString(),
    userId: userId,
    price: 20,
  });
  await item.save();

  const response = await request(app)
    .post("/api/payments")
    .set("Cookie", global.signin(userId))
    .send({
      token: "tok_visa",
      itemId: item.id,
    });
  console.log(response.body);

  const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];
  expect(chargeOptions.amount).toEqual(20 * 100);
  expect(chargeOptions.currency).toEqual("usd");

  const payment = await Payment.find();

  expect(payment.length).toEqual(1);
});
