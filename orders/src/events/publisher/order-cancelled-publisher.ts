import { Stan } from 'node-nats-streaming';
import { Publisher, OrderCancelledEvent, Subjects } from '@nagticketing/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.ORDER_CANCELLED = Subjects.ORDER_CANCELLED;

  constructor(client: Stan) {
    super(client);
  }

};