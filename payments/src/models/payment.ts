import mongoose, {HydratedDocument, mongo, Schema, Types} from "mongoose";

import { OrderDoc } from './order';

interface InputPaymentAttrs {
  paymentId: string;
  order: OrderDoc;
  userId: string;
};

interface PaymentAttrs {
  paymentId: string;
  order: OrderDoc;
  userId: Types.ObjectId;
};

type PaymentDoc = HydratedDocument<PaymentAttrs>;

interface PaymentModel extends mongoose.Model<PaymentAttrs> {
  build(attrs: InputPaymentAttrs): PaymentDoc;
}

const schema = new Schema<PaymentAttrs, PaymentModel>({
  paymentId: {
    type: String,
    required: true,
  },
  order: {
    type: Schema.Types.ObjectId,
    ref: 'order',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});


schema.statics.build = (attrs: InputPaymentAttrs) => {
  const paymentAttrs: PaymentAttrs = {
    paymentId: attrs.paymentId,
    userId: new Types.ObjectId(attrs.userId),
    order: attrs.order,
  };

  return new Payment(paymentAttrs);
}

const Payment: PaymentModel = mongoose.model<PaymentAttrs, PaymentModel>('payment', schema);

export { Payment };
