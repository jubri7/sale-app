import {
  BadRequestError,
  Listener,
  PaymentCreatedEvent,
  Subjects,
} from "@jugitix/common";
import { Message } from "node-nats-streaming";
import { Item } from "../../models/Item";
import { cartService } from "./queueGroupName";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = cartService;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    for (let id of data.items) {
      const item = await await Item.findByIdAndDelete(id);
      if (!item) throw new BadRequestError("Item not found");
    }

    msg.ack();
  }
}
