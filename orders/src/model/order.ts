import mongoose, { Schema, Types, HydratedDocument } from 'mongoose';
import { OrderStatus } from '@nagticketing/common';

import { TicketDoc } from './ticket';

interface InputOrderAttrs {
  userId: string;
  ticket: TicketDoc;
  expiresAt: Date;
  status: OrderStatus;
};


interface OrderAttrs {
  userId: string;
  ticket: TicketDoc;
  expiresAt: Date;
  status: OrderStatus;
};

type OrderDoc = HydratedDocument<OrderAttrs>;

interface OrderModel extends mongoose.Model<OrderAttrs> {
  build(attrs: InputOrderAttrs): OrderDoc
}

const ordersSchema = new Schema<OrderAttrs, OrderModel>({
  userId: {
    type: String,
    required: true
  },
  ticket: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'ticket'
  },
  expiresAt: {
    type: Schema.Types.Date,
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
    default: OrderStatus.CREATED
  }
}, {
  timestamps: true,
  optimisticConcurrency: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  }
});

ordersSchema.statics.build = (attrs: InputOrderAttrs): OrderDoc => {
  const orderAttrs: OrderAttrs = {
    userId: attrs.userId,
    ticket: attrs.ticket,
    expiresAt: attrs.expiresAt,
    status: attrs.status
  };

  return new Order(orderAttrs);
};

const Order: OrderModel = mongoose.model<OrderAttrs, OrderModel>('orders', ordersSchema);

export { Order, OrderStatus };