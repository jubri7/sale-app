import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Item } from "../../models/Item";
import { ItemStatus } from "@jugitix/common";

it("returns 200 with a list of all items", async () => {
  const user = new mongoose.Types.ObjectId().toHexString();
  const item1 = Item.build({
    name: "aasas",
    price: 10,
    image: "sdsfsdfsd",
    userId: user,
    status: ItemStatus.AwaitingPayment,
  });
  const item2 = Item.build({
    name: "aasas",
    price: 10,
    image: "dfgfhgdfgd",
    userId: user,
    status: ItemStatus.AwaitingPayment,
  });
  await item1.save();
  await item2.save();

  const response = await request(app).get("/api/items").send().expect(200);

  expect(response.body.length).toEqual(2);
});
