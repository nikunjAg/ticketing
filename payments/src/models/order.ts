import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';
import { OrderStatus } from '@nagticketing/common';

interface InputOrderAttrs {
  id?: string;
  status: OrderStatus;
  __v: number;
  userId: string;
  price: number;
};

interface OrderAttrs {
  _id?: Types.ObjectId;
  status: OrderStatus;
  __v: number;
  userId: Types.ObjectId;
  price: number;
};

type OrderDoc = HydratedDocument<OrderAttrs>;

interface OrderModel extends mongoose.Model<OrderAttrs> {
  build(attrs: InputOrderAttrs): OrderDoc;
  findByIdAndOldVersion(event: { id: string; __v: number }): Promise<OrderDoc | null>;
};

const orderSchema = new Schema<OrderAttrs, OrderModel>({
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  price: {
    type: Number,
    required: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform(doc, ret, options) {
      ret.id = ret._id;
      delete ret._id;
    },
  }
});

// Static methods

// Build order 
orderSchema.statics.build = (attrs: InputOrderAttrs): OrderDoc => {
  const orderAttrs: OrderAttrs = {
    _id: new Types.ObjectId(attrs.id),
    status: attrs.status,
    __v: attrs.__v,
    userId: new Types.ObjectId(attrs.userId),
    price: attrs.price
  };

  return new Order(orderAttrs);
}

// Find Order by id and old version
orderSchema.statics.findByIdAndOldVersion = async (event: { id: string; __v: number }): Promise<OrderDoc | null> => {

  const { id: orderId, __v: currentVersion } = event;

  return await Order.findOne({ _id: orderId, __v: currentVersion - 1 });
}


// Hooks

// pre save hook
orderSchema.pre('save', function(done){
  if (!this.isNew) {
    this.$where = {
      __v: this.get('__v') - 1
    };
  }

  done();
});

const Order: OrderModel = mongoose.model<OrderAttrs, OrderModel>('order', orderSchema);

export { Order };