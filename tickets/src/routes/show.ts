import express, { Request, Response, } from 'express';
import { NotFoundError } from '@nagticketing/common';

import { Ticket } from '../model';

const router = express.Router();

router.get(
  '/api/tickets/:id?',
  async (req: Request, res: Response) => {
    const { id: ticketId } = req.params;
    
    // Return all the tickets of no ticketId is present
    if (!ticketId) {
      const tickets = await Ticket.find({});
      
      return res
			.status(200)
			.json({ message: "Tickets fetched successfully", tickets });
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    res
      .status(200)
      .json({
        message: 'Ticket found sucessfully',
        ticket
      });
  }
);

export {router as showTicketRouter};