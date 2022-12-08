import { NotFoundError, OrderStatus, requireAuth } from '@nagticketing/common';
import express, {Request, Response} from 'express';

import { Order } from '../model/order';
import { natsWrapper } from '../nats-wrapper';
import { OrderCancelledPublisher } from '../events/publisher/order-cancelled-publisher';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response, next) => {
  
    const {id: orderId} = req.params;

    const order = await Order.findOne({ _id: orderId, userId: req.currentUser!.id }).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    } 

    order.status = OrderStatus.CANCELLED;

    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
      id: order.id,
      __v: order.__v,
      status: order.status,
      userId: order.userId.toString(),
      ticket: {
        id: order.ticket.id,
        price: order.ticket.price,
      },
    });

    res.status(204).send({
      message: 'Order cancelled successfully',
      order
    });

});

export default router;