import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Cart } from "../../models/Cart";
import { Item } from "../../models/Item";

it("returns 200 if item is added to cart", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const cart = Cart.build({ userId });
  const item1 = Item.build({
    name: "avd",
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
    image: Buffer.from("asasdasdsad"),
  });
  const item2 = Item.build({
    name: "avd",
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
    image: Buffer.from("asasdasdsad"),
  });
  await item1.save();
  await item2.save();
  await cart.save();

  await request(app)
    .post("/api/cart")
    .set("Cookie", global.signin(userId))
    .send({ itemId: item1.id })
    .expect(200);

  const response = await request(app)
    .post("/api/cart")
    .set("Cookie", global.signin(userId))
    .send({ itemId: item2.id })
    .expect(200);

  expect(response.body.items.length).toEqual(2);
});

it("returns 400 if cart not found", async () => {
  await request(app)
    .post("/api/cart")
    .set("Cookie", global.signin())
    .send({ itemId: new mongoose.Types.ObjectId().toHexString() })
    .expect(400);
});
