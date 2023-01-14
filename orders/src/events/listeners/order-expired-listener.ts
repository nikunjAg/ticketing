import { Message } from "node-nats-streaming";
import { Listener, OrderExpiredEvent, OrderStatus, Subjects } from "@nagticketing/common"

import { Order } from "../../model/order";
import { OrderCancelledPublisher } from "../publisher/order-cancelled-publisher";

const queueGroupName = 'order-service';

export class OrderExpiredListener extends Listener<OrderExpiredEvent> {
  subject: Subjects.ORDER_EXPIRED = Subjects.ORDER_EXPIRED;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderExpiredEvent['data'], msg: Message) {
    const { id: orderId } = data;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new Error("No such order exists to expire");
    }

    order.set('status', OrderStatus.CANCELLED);

    const isModified = order.isModified();

    await order.save();

    if (isModified) {
      new OrderCancelledPublisher(this.client)
        .publish({
          id: order.id,
          __v: order.__v,
          status: order.status,
          userId: order.userId,
          ticket: {
            id: order.ticket.id,
            price: order.ticket.price,
          },
        });
    }

    msg.ack();

  }

}