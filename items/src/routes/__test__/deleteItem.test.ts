import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Item } from "../../models/Item";

it("returns 200 and deletes item", async () => {
  const user = new mongoose.Types.ObjectId().toHexString();
  const item = Item.build({
    name: "aasas",
    price: 10,
    image: "adsdasdasd",
    userId: user,
  });
  await item.save();

  await request(app)
    .delete("/api/items")
    .set("Cookie", global.signin(user))
    .send({ itemId: item.id })
    .expect(200);

  const items = await Item.find({});

  expect(items.length).toEqual(0);
});

it("returns 400 if item does not exist", async () => {
  await request(app)
    .delete("/api/items")
    .set("Cookie", global.signin())
    .send({ itemId: new mongoose.Types.ObjectId().toHexString() })
    .expect(400);
});

it("returns 401 if user is not allow to delete item", async () => {
  const user = new mongoose.Types.ObjectId().toHexString();
  const item = Item.build({
    name: "aasas",
    price: 10,
    image: "asdadasdasd",
    userId: user,
  });
  await item.save();

  await request(app)
    .delete("/api/items")
    .set("Cookie", global.signin())
    .send({ itemId: item.id })
    .expect(401);
});
