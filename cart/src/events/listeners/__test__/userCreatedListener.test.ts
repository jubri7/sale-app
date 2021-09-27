import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { UserCreatedEvent } from "@jugitix/common";
import { natsWrapper } from "../../../stan";
import { UserCreatedListener } from "../userCreatedListener";
import { Cart } from "../../../models/Cart";

const setup = async () => {
  const listener = new UserCreatedListener(natsWrapper.client);

  const data: UserCreatedEvent["data"] = {
    id: mongoose.Types.ObjectId().toHexString(),
    email: "test24@test.com",
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

  const cart = await Cart.findOne({ userId: data.id });

  expect(cart!.userId).toEqual(data.id);
});

it("acknowledges the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
