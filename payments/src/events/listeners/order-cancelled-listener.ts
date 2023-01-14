import { Listener, OrderCancelledEvent, Subjects } from "@nagticketing/common";
import { Message } from "node-nats-streaming";

import { Order } from "../../models/order";

const queueGroupName = 'payments-service';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;
  queueGroupName: string = queueGroupName;
  
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    const order = await Order.findByIdAndOldVersion(data);

    if(!order) {
      throw new Error('No such order found to be cancelled');
    }

    order.set({
      status: data.status,
      __v: data.__v,
    });

    await order.save();

    msg.ack();

  }

}