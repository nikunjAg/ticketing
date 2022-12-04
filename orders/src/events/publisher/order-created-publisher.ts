import { Stan } from 'node-nats-streaming';
import { Publisher, OrderCreatedEvent, Subjects } from '@nagticketing/common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.ORDER_CREATED = Subjects.ORDER_CREATED;

  constructor(client: Stan) {
    super(client);
  }

};