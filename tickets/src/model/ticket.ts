import mongoose, { HydratedDocument, Types, Schema, } from "mongoose";
import { OrderStatus } from "@nagticketing/common";

interface InputTicketAttrs {
  title: string;
  price: number;
  userId: string;
};

interface OrderAttrs {
  id: string;
  status: OrderStatus;
}

interface TicketAttrs {
  title: string;
  price: number;
  userId: Types.ObjectId;
  order?: OrderAttrs;
};

type TicketDoc = HydratedDocument<TicketAttrs>;

interface TicketModel extends mongoose.Model<TicketAttrs> {
  build(attrs: InputTicketAttrs): TicketDoc 
};

const schema = new Schema<TicketAttrs, TicketModel>({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  order: {
    id: String,
    status: {
      type: String,
      enum: Object.values(OrderStatus),
    },
  }
}, {
  timestamps: true,
  optimisticConcurrency: true,
  toJSON: {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;

    },
  }
});

schema.statics.build = (attrs: InputTicketAttrs): TicketDoc => {
  // Getting input ticket attrs,
  // converting them to ticket attrs
  // and finally creating a ticket document using ticket attrs
  const ticketAttrs: TicketAttrs = {
    title: attrs.title,
    price: attrs.price,
    userId: new Types.ObjectId(attrs.userId),
  };

  return new Ticket(ticketAttrs);
};

const Ticket: TicketModel = mongoose.model<TicketAttrs, TicketModel>('Ticket', schema);

export { Ticket };