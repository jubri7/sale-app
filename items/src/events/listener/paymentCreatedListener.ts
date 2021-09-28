import {
  BadRequestError,
  ItemStatus,
  Listener,
  PaymentCreatedEvent,
  Subjects,
} from "@jugitix/common";
import { Message } from "node-nats-streaming";
import { Item } from "../../models/Item";
import { itemService } from "./queueGroupName";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = itemService;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const item = await Item.findOne({ id: data.itemId });
    if (!item) throw new BadRequestError("Item not found");
    item.set("status", ItemStatus.Purchased);
    await item.save();

    msg.ack();
  }
}
