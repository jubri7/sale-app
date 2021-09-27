import { Publisher, Subjects, ItemRemovedEvent } from "@jugitix/common";

export class ItemRemovedPublisher extends Publisher<ItemRemovedEvent> {
  subject: Subjects.ItemRemoved = Subjects.ItemRemoved;
}
