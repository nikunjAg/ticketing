import express, { Request, Response } from 'express';
import { Stripe } from 'stripe';

import { stripe } from '../stripe';

const router = express.Router();
const endpointSecret = 'whsec_...';


router.post(
  '/api/webhook',
  async (req: Request, res: Response) => {
    const payload = req.body;
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(payload, sig!, endpointSecret);
    } catch (err: any) {
      return res.status(400).send(`Webhook Error: ${err.message!}`);
    }
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(session);
      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ["line_items"] }
      );
      const line_items = sessionWithLineItems.line_items;
      console.log(line_items);
    } else if (event.type === 'checkout.session.async_payment_succeeded') {
      console.log('Payment succedded', event);
    } else if (event.type === 'checkout.session.async_payment_failed') {
      console.log('Payment failed', event);
    } else {
      console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.status(200).end();
  }
)

export { router as paymentsEventsRouter };