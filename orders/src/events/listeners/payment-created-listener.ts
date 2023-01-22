import { Listener, OrderStatus, PaymentCreatedEvent, Subjects } from "@nagticketing/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../model/order";
import { OrderCompletePublisher } from "../publisher/order-complete-publisher";

const queueGroupName = 'order-service';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  subject: Subjects.PAYMENT_CREATED = Subjects.PAYMENT_CREATED;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], msg: Message) {
    const { orderId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('No such order exists');
    }

    order.set('status', OrderStatus.COMPLETE);

    const isModified = order.isModified();

    await order.save();

    if (isModified) {
      new OrderCompletePublisher(this.client)
        .publish({
          id: order.id,
          userId: order.userId,
          status: order.status,
          __v: order.__v,
          ticket: {
            id: order.ticket.id,
            price: order.ticket.price,
            title: order.ticket.title,
          }
        });
    }

    msg.ack();

  }
  
}