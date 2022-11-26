import { Stan } from 'node-nats-streaming';

import { Publisher, Subjects, TicketUpdatedEvent } from "@nagticketing/common";

export class TickerUpdatedPublisher extends Publisher<TicketUpdatedEvent>{
  subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;

  constructor(client: Stan) {
    super(client);
  };

};