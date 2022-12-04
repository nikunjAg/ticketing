import { NotFoundError, requireAuth } from '@nagticketing/common';
import express, {Request, Response} from 'express';

import { Order } from '../model/order';

const router = express.Router();

router.get(
  '/api/orders/:id?',
  requireAuth,
  async (req: Request, res: Response) => {
  
    const {id: orderId} = req.params;

    if (orderId) {
      const order = await Order.findOne({
        _id: orderId, userId: req.currentUser!.id
      })
      .populate('ticket');

      if (!order) {
        throw new NotFoundError();
      }

      return res.status(200).json({
        message: "Order fetched successfully",
        order
      });
    }

    const orders = await Order.find({
      userId: req.currentUser!.id
    })
    .populate('ticket');

    return res.status(200).json({
      message: "Orders fetched successfully",
      orders
    });

  }
);

export default router;