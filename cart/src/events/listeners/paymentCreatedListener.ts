import { Listener, PaymentCreatedEvent, Subjects } from "@jugitix/common";
import { ObjectId } from "mongoose";
import { Message } from "node-nats-streaming";
import { Cart } from "../../models/Cart";
import { Item } from "../../models/Item";
import { cartService } from "./queueGroupName";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = cartService;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    interface removedItemType {
      [id: string]: boolean;
    }
    const removedItems: removedItemType = {};
    for (let id of data.items) {
      const item = await Item.findByIdAndDelete(id);
      if (!item) throw new Error("Item not found");
      removedItems[id] = true;
    }
    const cart = await Cart.findOne({ userId: data.userId });
    if (!cart) return msg.ack();

    cart.items = cart.items.filter((id: any) => {
      return !(String(id) in removedItems);
    });
    await cart.save();

    msg.ack();
  }
}
