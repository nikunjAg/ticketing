import { Stan } from 'node-nats-streaming';

import { Publisher, Subjects } from "@nagticketing/common";
import { OrderExpiredEvent } from "@nagticketing/common/build/events/order-events";

export class OrderExpiredPublisher extends Publisher<OrderExpiredEvent> {
  subject: Subjects.ORDER_EXPIRED = Subjects.ORDER_EXPIRED;
  
  constructor(client: Stan) {
    super(client);
  }
};