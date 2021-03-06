import { Subjects, Publisher, ExpirationCompleteEvent } from "@wawatickets/common";

export class ExpirationCompletePublsher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}