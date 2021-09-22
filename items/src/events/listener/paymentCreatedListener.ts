import { Listener, PaymentCreatedEvent, Subjects } from "@jugitix/common";
import { Message } from "node-nats-streaming";
import { Item } from "../../models/Item";
import { itemService } from "./queueGroupName";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = itemService;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    await Item.deleteOne({ id: data.itemId });

    msg.ack();
  }
}
