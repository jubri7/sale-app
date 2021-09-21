import { Publisher, Subjects, ItemCreatedEvent } from "@jugitix/common";

export class ItemCreatedPublisher extends Publisher<ItemCreatedEvent> {
  subject: Subjects.ItemCreated = Subjects.ItemCreated;
}
