import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Item } from "../../models/Item";
import { ItemStatus } from "@jugitix/common";

it("returns 200 with the item", async () => {
  const user = new mongoose.Types.ObjectId().toHexString();
  const item = Item.build({
    name: "aasas",
    price: 10,
    image: "sdsfsdfsd",
    userId: user,
    status: ItemStatus.AwaitingPayment,
  });
  await item.save();

  const response = await request(app)
    .get(`/api/items/${item.id}`)
    .send()
    .expect(200);

  expect(response.body.id).toEqual(item.id);
});

it("returns 400 if item does not exist", async () => {
  await request(app)
    .get(`/api/items/${new mongoose.Types.ObjectId().toHexString()}`)
    .send()
    .expect(400);
});
