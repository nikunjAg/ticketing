import express, { Request, Response, } from 'express';
import { body, } from 'express-validator';
import { requireAuth, validateRequest } from '@nagticketing/common';

import { Ticket } from '../model';
import { natsWrapper } from '../nats-wrapper';
import { TicketCreatedPublisher } from '../events/publishers/ticket-created-publisher';

const router = express.Router();

router.post(
  '/api/tickets',
  requireAuth,
  [
    body('title')
      .not()
      .isEmpty()
      .withMessage('Title is required'),
    body('price')
      .isFloat({ gt: 0 })
      .withMessage('Price must be a string of min length 5'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    
    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id });
    await ticket.save();

    // publish the event
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId.toString(),
      __v: ticket.__v,
    });

    res
      .status(201)
      .json({
        message: 'Ticket created sucessfully',
        ticket
      });
  }
);

export {router as createTicketRouter};