import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, BadRequestError, validateRequest, OrderStatus, NotAuthorizedError } from '@nagticketing/common';

import { Order } from '../models/order';
import { Payment } from '../models/payment';
import { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events/publisher/payment-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [
    body('token')
      .not()
      .isEmpty()
      .withMessage('Please send a valid token'),
    body('orderId')
      .not()
      .isEmpty()
      .withMessage('Please send a valid Order id'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    
    const { orderId, token } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new BadRequestError('No such order exists.');
    }

    if (order.userId.toString() !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }
    if (order.status === OrderStatus.COMPLETE) {
      throw new BadRequestError('Order has already been paid');
    }
    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestError('Cannot pay for Order that has been cancelled');
    }
    if (order.status === OrderStatus.AWAITING_PAYMENT) {
      throw new BadRequestError('Order has already been paid, waiting for payment to succeed.');
    }
    
    const { ticket, userId } = order;

    try {

      const charge = await stripe.charges.create({
        amount: ticket.price * 100,
        currency: 'INR',
        description: `Payment for ticket id ${ticket.id} at price: ${ticket.price}`,
        source: token,
      });

      const payment = Payment.build({
        paymentId: charge.id,
        order,
        userId: userId.toString(),
      });

      await payment.save();

      new PaymentCreatedPublisher(natsWrapper.client)
      .publish({
        id: payment.id,
        chargeId: payment.paymentId,
        orderId: payment.order.id,
        userId: payment.userId.toString(),
        ticket: {
          id: order.ticket.id.toString(),
        }
      });

      return res.status(201).json({
        success: true,
        message: "Payment done successfully",
      });

    } catch(error: any) {
      return res.status(500).json({success: false, message: error.message, code: error.code });
    }

  }
)

export { router as createChargeRouter };