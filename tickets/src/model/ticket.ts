import mongoose, { HydratedDocument, Types, Schema, } from "mongoose";


interface InputTicketAttrs {
  title: string;
  price: number;
  userId: string;
};

interface TicketAttrs {
  title: string;
  price: number;
  userId: Types.ObjectId;
};

type TicketDoc = HydratedDocument<TicketAttrs>;

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: InputTicketAttrs): TicketDoc 
};

const schema = new Schema<TicketDoc, TicketModel>({
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
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;

    },
  }
});

const Ticket: TicketModel = mongoose.model<TicketDoc, TicketModel>('Ticket', schema);

schema.statics.build = (attrs: InputTicketAttrs): TicketDoc => {
  // Getting input ticket attrs,
  // converting them to ticket attrs
  // and finally creating a ticket document using ticket attrs
  const ticketAttrs: TicketAttrs = {
    title: attrs.title,
    price: attrs.price,
    userId: new Types.ObjectId(attrs.userId)
  };

  return new Ticket(ticketAttrs);
};


export { Ticket };