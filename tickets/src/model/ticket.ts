import mongoose, { HydratedDocument, Types, Schema, } from "mongoose";


interface InputTicketAttrs {
  title: string;
  price: number;
  userId: string;
};

interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
  orderId?: string;
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
    type: String,
    required: true
  },
  orderId: {
    type: String,
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
    userId: attrs.userId,
  };

  return new Ticket(ticketAttrs);
};

const Ticket: TicketModel = mongoose.model<TicketAttrs, TicketModel>('Ticket', schema);

export { Ticket };