import mongoose, { Schema, Types, HydratedDocument } from 'mongoose';
import { Order, OrderStatus } from './order';

interface InputTicketAttrs {
  title: string;
  price: number;
};

interface TicketAttrs {
  title: string;
  price: number;
};

interface TicketMethods {
  isReserved(): Promise<boolean>
};

type TicketDoc = HydratedDocument<TicketAttrs, TicketMethods>;

interface TicketModel extends mongoose.Model<TicketAttrs, {}, TicketMethods> {
  build(attrs: InputTicketAttrs): TicketDoc
}

const ticketSchema = new Schema<TicketAttrs, TicketModel, TicketMethods>({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  }
});

ticketSchema.statics.build = (attrs: InputTicketAttrs): TicketDoc => {
  const ticketAttrs: TicketAttrs = {
    title: attrs.title,
    price: attrs.price
  };
  return new Ticket(ticketAttrs);
};

ticketSchema.methods.isReserved = async function(): Promise<boolean> {
  const reservedOrder = await Order.findOne({
    ticket: this._id,
    status: {
      $ne: OrderStatus.CANCELLED
    } 
  });

  return !!reservedOrder;
};


const Ticket: TicketModel = mongoose.model<TicketAttrs, TicketModel>('ticket', ticketSchema);

export { Ticket, TicketDoc };