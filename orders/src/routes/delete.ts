import { NotFoundError, OrderStatus, requireAuth } from '@nagticketing/common';
import express, {Request, Response} from 'express';

import { Order } from '../model/order';

const router = express.Router();

router.delete(
  '/api/orders/:id',
  requireAuth,
  async (req: Request, res: Response, next) => {
  
    const {id: orderId} = req.params;

    const order = await Order.findOne({ _id: orderId, userId: req.currentUser!.id })

    if (!order) {
      throw new NotFoundError();
    } 

    order.status = OrderStatus.CANCELLED;

    await order.save();

    // TODO: Publish an event saying this order was cancelled

    res.status(204).send({
      message: 'Order cancelled successfully',
      order
    });

});

export default router;