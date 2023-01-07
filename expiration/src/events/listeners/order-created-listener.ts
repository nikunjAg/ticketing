import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@nagticketing/common";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration-queue";

const queueGroupName = 'expiration-service';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;
  queueGroupName: string = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
    const { id: orderId, expiresAt } = data;
    const delay = new Date(expiresAt).getTime() - Date.now();
    
    await expirationQueue.add(
      {
        orderId
      },
      {
        delay
      }
    );

    msg.ack();
  }
  
}