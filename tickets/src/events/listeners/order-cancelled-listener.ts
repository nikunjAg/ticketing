import { Listener, OrderCancelledEvent, Subjects } from "@nagticketing/common";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../model";
import { TickerUpdatedPublisher } from "../publishers/ticket-updated-publisher";

const QUEUE_GROUP_NAME = 'tickets-service';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
  queueGroupName: string = QUEUE_GROUP_NAME;
  
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const { ticket: { id: ticketId } } = data;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ order: undefined });
    
    const isModified = ticket.isModified();

    await ticket.save();
    
    if (isModified) {
      new TickerUpdatedPublisher(this.client)
        .publish({
          id: ticket.id,
          __v: ticket.__v,
          title: ticket.title,
          price: ticket.price,
          userId: ticket.userId.toString(),
          orderId: ticket.order?.id.toString(),
        });
    }

    msg.ack();
  }
  
}