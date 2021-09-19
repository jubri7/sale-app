import { Listener, UserCreatedEvent, Subjects } from "@jugitix/common";
import { Message } from "node-nats-streaming";
import { Cart } from "../../models/Cart";
import { cartService } from "./queueGroupName";

export class PaymentCreatedListener extends Listener<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
  queueGroupName = cartService;

  async onMessage(data: UserCreatedEvent["data"], msg: Message) {
    const cart = Cart.build({ userId: data.id });
    await cart.save();
    msg.ack();
  }
}
