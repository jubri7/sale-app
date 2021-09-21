import request from "supertest";
import mongoose from "mongoose";
import { app } from "../../app";
import { Item } from "../../models/Item";

it("add items and returns 200", async () => {
  const response = await request(app)
    .post("/api/items")
    .set("Cookie", global.signin())
    .attach("file", __dirname + "/image5.jpeg")
    .field("name", "adsad")
    .field("price", 10)
    .expect(200);

  expect(response.body.name).toEqual("adsad");
  expect(response.body.price).toEqual("10");
  expect(response.body.image.type).toEqual("Buffer");
});

it("return 401 if user not sign in", async () => {
  await request(app)
    .post("/api/items")
    .send({
      name: "asfsa",
      price: 10,
      image: Buffer.from("sdfsdfsdfdsfs"),
    })
    .expect(401);
});

it("return 400 if user provides invalid name or price", async () => {
  await request(app)
    .post("/api/items")
    .set("Cookie", global.signin())
    .attach("file", __dirname + "/image5.jpeg")
    .field("name", "")
    .field("price", 10)
    .expect(400);

  await request(app)
    .post("/api/items")
    .set("Cookie", global.signin())
    .attach("file", __dirname + "/image5.jpeg")
    .field("name", "adsad")
    .field("price", 0)
    .expect(400);
});
