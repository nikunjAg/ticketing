import express, { Request, Response, } from 'express';
import { body, } from 'express-validator';
import { requireAuth, validateRequest } from '@nagticketing/common';

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
  (req: Request, res: Response) => {
    const { title, price } = req.body;
  }
);

export {router as createTicketRouter};