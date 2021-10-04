import {
  BadRequestError,
  ItemStatus,
  Listener,
  PaymentCreatedEvent,
  Subjects,
} from "@jugitix/common";
import { Message } from "node-nats-streaming";
import { Item } from "../../models/Item";
import { redisClient } from "../../redis";
import { itemService } from "./queueGroupName";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = itemService;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    for (let id of data.items) {
      const item = await Item.findById(id);
      if (!item) throw new BadRequestError("Item not found");
      item.set("status", ItemStatus.Purchased);
      await item.save();
      redisClient.client.del(item.id);
    }
    redisClient.client.del("items");

    msg.ack();
  }
}
