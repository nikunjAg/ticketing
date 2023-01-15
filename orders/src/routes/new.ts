import express, {Request, Response} from 'express';
import mongoose from 'mongoose';
import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@nagticketing/common';
import { body } from 'express-validator';

import { Ticket } from '../model/ticket';
import { Order } from '../model/order';
import { OrderCreatedPublisher } from '../events/publisher/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();
const EXPIRATION_WINDOW_SECONDS = 1*60;

router.post(
  '/api/orders', 
  requireAuth,
  [
    body('ticketId')
      .not()
      .isEmpty()
      .custom((ticketId: string) => mongoose.Types.ObjectId.isValid(ticketId))
      .withMessage('TicketId must be provided')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Get the ticket
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure the ticket has not already been reserved
    const isAlreadyReserved = await ticket.isReserved();
    if (isAlreadyReserved) {
      throw new BadRequestError('Ticket has already been reserved');
    }

    // Create order with expiry time
    const expirationDate = new Date();
    expirationDate.setSeconds(
      expirationDate.getSeconds() + EXPIRATION_WINDOW_SECONDS
    );

    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.CREATED,
      expiresAt: expirationDate,
      ticket,
    })

    // Save order to database
    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      __v: order.__v,
      status: order.status,
      expiresAt: order.expiresAt.toISOString(),
      userId: order.userId.toString(),
      ticket: {
        id: ticket.id,
        price: ticket.price,
        title: ticket.title,
      },
    });

    // Respond back to user
    res.status(201).json({
      message: 'Order placed successfully',
      order
    });

  }
);

export default router;