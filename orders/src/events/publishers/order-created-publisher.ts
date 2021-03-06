import { Publisher, OrderCreatedEvent, Subjects } from "@wawatickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}