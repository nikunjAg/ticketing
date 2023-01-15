import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { requireAuth, BadRequestError, validateRequest, OrderStatus } from '@nagticketing/common';

import { Order } from '../models/order';
import { stripe } from '../stripe';

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
    
    const { orderId } = req.body;

    const order = await Order.findOne({id: orderId, userId: req.currentUser});

    if (!order) {
      throw new BadRequestError('No such order exists.');
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
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: order.tickets.map(t => ({
        price_data: {
          currency: "inr",
          product_data: {
            name: t.title,
            description: `${t.title} ordered at price ${t.price}`,
          },
          unit_amount: t.price * 100,
        },
        quantity: 1,
      })),
      client_reference_id: order.id.toString(),
      success_url: "http://ticketing.dev:3000/order/success",
      cancel_url: "http://ticketing.dev:3000/order/cancel",
    });

    return res.status(201).json({
      success: true,
      message: "Stripe session id generated successfully",
      url: session.url,
    });

  }
)

export { router as createChargeRouter };