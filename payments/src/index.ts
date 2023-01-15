import express from "express";
import { json } from 'body-parser';
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser, } from '@nagticketing/common';
import 'express-async-errors';

import { natsWrapper } from './nats-wrapper';
import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener';
import { createChargeRouter } from './routes/new';
import { paymentsEventsRouter } from './routes/payment-updates';

const app = express();
const PORT = 3000;

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true,
}));

app.use(currentUser);

app.use(createChargeRouter);
app.use(paymentsEventsRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY)
    throw new Error("JWT_KEY is not defined");
  if (!process.env.MONGO_URI)
    throw new Error("MONGO_URI is not defined");
  if (!process.env.NATS_CLUSTER_ID)
    throw new Error("NATS_CLUSTER_ID is not defined");
  if (!process.env.NATS_CLIENT_ID)
    throw new Error("NATS_CLIENT_ID is not defined");
  if (!process.env.NATS_URL)
    throw new Error("NATS_URL is not defined");

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, {
      url: process.env.NATS_URL
    });

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });

    process.on('SIGINT', natsWrapper.client.close);
    process.on('SIGTERM', natsWrapper.client.close);

    await mongoose.connect(process.env.MONGO_URI);

    new OrderCreatedListener(natsWrapper.client).listen();
    new OrderCancelledListener(natsWrapper.client).listen();

    console.log('Connected to MongoDB');
  } catch(err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Tickets service started on port ${PORT}`);
  });
};

start();