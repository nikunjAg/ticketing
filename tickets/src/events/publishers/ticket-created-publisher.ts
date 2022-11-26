import { Stan } from 'node-nats-streaming';

import { Publisher, Subjects, TicketCreatedEvent } from '@nagticketing/common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;

  constructor(client: Stan) {
    super(client);
  }

}