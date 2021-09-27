import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { ItemCreatedEvent } from "@jugitix/common";
import { natsWrapper } from "../../../stan";
import { ItemCreatedListener } from "../itemCreatedListener";
import { Item } from "../../../models/Item";

const setup = async () => {
  const listener = new ItemCreatedListener(natsWrapper.client);

  const data: ItemCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    userId: "alskdjf",
    price: 10,
    image: "test url",
    name: "absadsdf",
  };

  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it("replicates the order info", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const item = await Item.findOne({ name: data.name });

  expect(item!.name).toEqual(data.name);
});

it("acknowledges the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
