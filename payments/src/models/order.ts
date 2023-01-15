import mongoose, { HydratedDocument, Schema, Types } from 'mongoose';
import { OrderStatus } from '@nagticketing/common';

interface TicketAttrs {
  id: string;
  price: number;
  title: string
};

interface InputOrderAttrs {
  id?: string;
  status: OrderStatus;
  __v: number;
  userId: string;
  tickets: TicketAttrs[]
};

interface OrderAttrs {
  _id?: Types.ObjectId;
  status: OrderStatus;
  __v: number;
  userId: Types.ObjectId;
  tickets: TicketAttrs[]
};

type OrderDoc = HydratedDocument<OrderAttrs>;

interface OrderModel extends mongoose.Model<OrderAttrs> {
  build(attrs: InputOrderAttrs): OrderDoc;
  findByIdAndOldVersion(event: { id: string; __v: number }): Promise<OrderDoc | null>;
};

const ticketSchema = new Schema<TicketAttrs> ({
  price: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true
  }
});

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
  tickets: {
    type: [ticketSchema],
    required: true,
    validate: {
      validator: function(v: TicketAttrs[]) {
        return v.length > 0;
      },
      message: function(props) {
        return `${props.path} cannot be empty.`
      }
    }
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
    tickets: []
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