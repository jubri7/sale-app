import { Listener, ItemCreatedEvent, Subjects } from "@jugitix/common";
import { Message } from "node-nats-streaming";
import { Item } from "../../models/Item";
import { queueGroupName } from "./queueGroupName";

export class ItemCreatedListener extends Listener<ItemCreatedEvent> {
  subject: Subjects.ItemCreated = Subjects.ItemCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: ItemCreatedEvent["data"], msg: Message) {
    const item = Item.build({
      _id: data.id,
      price: data.price,
      userId: data.userId,
    });
    await item.save();
    msg.ack();
  }
}
