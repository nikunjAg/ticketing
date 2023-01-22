import { Message } from "node-nats-streaming";
import { Listener, OrderCreatedEvent, Subjects } from "@nagticketing/common";

import { Order } from "../../models/order";

const queueGroupName = 'payments-service';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
  queueGroupName: string = queueGroupName;
  
  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {

    const order = Order.build({
      id: data.id,
      status: data.status,
      __v: data.__v,
      userId: data.userId,
      ticket: {
        id: data.ticket.id,
        title: data.ticket.title,
        price: data.ticket.price,
      }
    });

    await order.save();

    msg.ack();
  }

}