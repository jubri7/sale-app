import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Item } from "../../models/Item";

it("returns 200 with a list of all items", async () => {
  const user = new mongoose.Types.ObjectId().toHexString();
  const item1 = Item.build({
    name: "aasas",
    price: 10,
    image: "sdsfsdfsd",
    userId: user,
  });
  const item2 = Item.build({
    name: "aasas",
    price: 10,
    image: "dfgfhgdfgd",
    userId: user,
  });
  await item1.save();
  await item2.save();

  const response = await request(app).get("/api/items").send().expect(200);

  expect(response.body.length).toEqual(2);
});
