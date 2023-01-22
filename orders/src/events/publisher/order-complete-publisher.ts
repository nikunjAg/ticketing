import { Publisher, Subjects, OrderCompleteEvent } from "@nagticketing/common";

export class OrderCompletePublisher extends Publisher<OrderCompleteEvent> {
  subject: Subjects.ORDER_COMPLETE = Subjects.ORDER_COMPLETE;
}