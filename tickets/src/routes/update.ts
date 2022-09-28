import express, { Request, Response, } from 'express';
import { body, } from 'express-validator';
import { requireAuth, validateRequest, NotFoundError, NotAuthorizedError } from '@nagticketing/common';

import { Ticket } from '../model';

const router = express.Router();

router.put(
  '/api/tickets/:id',
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
    const { id } = req.params;
    
    const ticket = await Ticket.findById(id);
    
    // If no such ticket exists
    if (!ticket) {
      throw new NotFoundError();
    }

    // If user is not authorized to edit this ticket
    if (ticket.userId.toString() !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Updating the properties of document
    ticket.set({
      title,
      price
    })

    // Saving the changes to database
    await ticket.save();

    res
      .status(200)
      .json({
        message: 'Ticket updated sucessfully',
        ticket
      });
  }
);

export {router as updateTicketRouter};