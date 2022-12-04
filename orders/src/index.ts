import express from "express";
import { json } from 'body-parser';
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser, } from '@nagticketing/common';
import 'express-async-errors';

import { showOrdersRouter, createOrdersRouter, deleteOrdersRouter } from './routes';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from "./events/listeners/ticket-created-listener";
import { TicketUpdatedListener } from "./events/listeners/ticket-updated-listener";

const app = express();
const PORT = 3000;

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true,
}));

app.use(currentUser);

app.use(showOrdersRouter);
app.use(createOrdersRouter);
app.use(deleteOrdersRouter);

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
    console.log('Connected to MongoDB');
    
    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
  } catch(err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Tickets service started on port ${PORT}`);
  });
};

start();