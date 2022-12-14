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
    const { title, price, __v} = data;
    const ticket = await Ticket.findByIdAndOldVersion(data)
    
    if (!ticket) {
      throw new Error('Ticket not found or Received events out of order.');
    }
    
    // Update ticket & save
    ticket.set({ title, price, __v });
    await ticket.save();

    msg.ack();
  }
  
}