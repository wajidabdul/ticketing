import { Publisher, Subjects, TicketCreatedEvent } from "@wawatickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}