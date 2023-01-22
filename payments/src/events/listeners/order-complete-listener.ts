import { Listener, OrderCompleteEvent, OrderStatus, Subjects } from "@nagticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

const queueGroupName = 'payments-service';

export class OrderCompleteListener extends Listener<OrderCompleteEvent> {
  subject: Subjects.ORDER_COMPLETE = Subjects.ORDER_COMPLETE;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCompleteEvent['data'], msg: Message) {
    const { id: orderId, status, __v } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('No such order found to marked as completed');
    }

    order.set({
      'status': status,
      __v,
    });

    await order.save();

    msg.ack();
  }

}