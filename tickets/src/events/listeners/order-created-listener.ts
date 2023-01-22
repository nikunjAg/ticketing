import { Listener, OrderCreatedEvent, Subjects } from "@nagticketing/common";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../model";
import { TickerUpdatedPublisher } from "../publishers/ticket-updated-publisher";

const QUEUE_GROUP_NAME = 'tickets-service';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
  queueGroupName: string = QUEUE_GROUP_NAME;
  
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id: orderId, ticket: { id: ticketId }, status } = data;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set('order', { id: orderId, status });

    await ticket.save();

    new TickerUpdatedPublisher(this.client)
    .publish({
      id: ticket.id,
      __v: ticket.__v,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId.toString(),
      orderId: ticket.order?.id.toString(),
    });

    msg.ack();
  }
  
}