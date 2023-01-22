import { Listener, OrderCompleteEvent, OrderStatus, Subjects } from "@nagticketing/common";
import { Message } from "node-nats-streaming";

import { Ticket } from "../../model";
import { TickerUpdatedPublisher } from "../publishers/ticket-updated-publisher";

const queueGroupName = 'tickets-service';

export class OrderCompleteListener extends Listener<OrderCompleteEvent> {
  subject: Subjects.ORDER_COMPLETE = Subjects.ORDER_COMPLETE;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCompleteEvent['data'], msg: Message) {
    const { id: orderId, status } = data;

    const ticket = await Ticket.findOne({ "order.id": orderId, "order.status": OrderStatus.CREATED });

    if (!ticket) {
      throw new Error('No such ticket was ordered to be marked as complete');
    }

    ticket.set('order.status', status);

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