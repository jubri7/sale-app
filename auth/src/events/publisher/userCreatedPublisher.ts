import { Publisher, Subjects, UserCreatedEvent } from "@jugitix/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  subject: Subjects.UserCreated = Subjects.UserCreated;
}
