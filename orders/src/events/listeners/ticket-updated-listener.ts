import { Stan } from 'node-nats-streaming';

import { Listener, Subjects, TicketUpdatedEvent } from "@nagticketing/common";
import { Message } from "node-nats-streaming";
import { Ticket } from '../../model/ticket';

const queueGroupName = 'orders-service';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  subject: Subjects.TICKET_UPDATED = Subjects.TICKET_UPDATED;
  queueGroupName = queueGroupName;
  
  constructor(client: Stan) {
    super(client);
  }
  
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message): Promise<void> {
    const { id, title, price } = data;
    
    const ticket = await Ticket.findById(id)    
    if (!ticket) {
      throw new Error('Ticket not found.');
    }
    
    // Update ticket & save
    ticket.set({ title, price });
    await ticket.save();

    msg.ack();
  }
  
}

// new TicketCreatedListener(natsWrapper)