import { Listener, ItemRemovedEvent, Subjects } from "@jugitix/common";
import { Message } from "node-nats-streaming";
import { Item } from "../../models/Item";
import { cartService } from "./queueGroupName";

export class ItemRemovedListener extends Listener<ItemRemovedEvent> {
  subject: Subjects.ItemRemoved = Subjects.ItemRemoved;
  queueGroupName = cartService;

  async onMessage(data: ItemRemovedEvent["data"], msg: Message) {
    const item = Item.findOneAndDelete({ _id: data.id });

    msg.ack();
  }
}
