import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Cart } from "../../models/Cart";
import { Item } from "../../models/Item";

it("deletes item and returns 200", async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();
  const item1 = Item.build({
    name: "avs",
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
    image: Buffer.from("asasdasdsad"),
  });
  const item2 = Item.build({
    name: "avs",
    price: 10,
    id: new mongoose.Types.ObjectId().toHexString(),
    image: Buffer.from("asasdasdsad"),
  });
  const cart = await Cart.build({ userId });
  cart.items.push(item1.id);
  cart.items.push(item2.id);
  await item1.save();
  await item2.save();
  await cart.save();

  const response = await request(app)
    .delete("/api/cart")
    .set("Cookie", global.signin(userId))
    .send({ itemId: item2.id })
    .expect(200);

  expect(response.body.items[0]).toEqual(item1.id);
});

it("returns 400 if cart not found", async () => {
  await request(app)
    .post("/api/cart")
    .set("Cookie", global.signin())
    .send({ itemId: new mongoose.Types.ObjectId().toHexString() })
    .expect(400);
});
