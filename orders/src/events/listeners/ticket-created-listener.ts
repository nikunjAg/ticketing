import { Stan } from 'node-nats-streaming';

import { Listener, Subjects, TicketCreatedEvent } from "@nagticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from '../../model/ticket';

const queueGroupName = 'orders-service';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  subject: Subjects.TICKET_CREATED = Subjects.TICKET_CREATED;
  queueGroupName = queueGroupName;
  
  constructor(client: Stan) {
    super(client);
  }
  
  async onMessage(data: TicketCreatedEvent['data'], msg: Message): Promise<void> {
    const { id, title, price } = data;

    const ticket = Ticket.build({
      id,
      title,
      price,
    });

    await ticket.save();

    msg.ack();
  }
  
};