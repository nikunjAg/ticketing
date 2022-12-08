import mongoose, { Schema, Types, HydratedDocument } from 'mongoose';
import { Order, OrderStatus } from './order';

interface InputTicketAttrs {
  id?: string;
  title: string;
  price: number;
};

interface TicketAttrs {
  _id?: Types.ObjectId;
  title: string;
  price: number;
};

interface TicketMethods {
  isReserved(): Promise<boolean>
};

type TicketDoc = HydratedDocument<TicketAttrs, TicketMethods>;

interface TicketModel extends mongoose.Model<TicketAttrs, {}, TicketMethods> {
  build(attrs: InputTicketAttrs): TicketDoc,
  findByIdAndOldVersion(event: {id: string; __v: number;}): Promise<TicketDoc | null>,
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
  timestamps: true,
  optimisticConcurrency: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  }
});

ticketSchema.statics.findByIdAndOldVersion = async (event: {id: string; __v: number}): 
Promise<TicketDoc | null> => {
  return await Ticket.findOne({ _id: event.id, __v: event.__v - 1 });
};

ticketSchema.statics.build = (attrs: InputTicketAttrs): TicketDoc => {
  const ticketAttrs: TicketAttrs = {
    _id: new Types.ObjectId(attrs.id),
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