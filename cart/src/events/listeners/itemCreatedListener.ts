import { Listener, ItemCreatedEvent, Subjects } from "@jugitix/common";
import { Message } from "node-nats-streaming";
import { Item } from "../../models/Item";
import { cartService } from "./queueGroupName";

export class ItemCreatedListener extends Listener<ItemCreatedEvent> {
  subject: Subjects.ItemCreated = Subjects.ItemCreated;
  queueGroupName = cartService;

  async onMessage(data: ItemCreatedEvent["data"], msg: Message) {
    const item = Item.build({
      name: data.name,
      price: data.price,
      image: data.image,
      id: data.id,
    });
    await item.save();

    msg.ack();
  }
}
