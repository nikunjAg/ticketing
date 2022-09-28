import express from "express";
import { json } from 'body-parser';
import mongoose from "mongoose";
import cookieSession from "cookie-session";
import { NotFoundError, errorHandler, currentUser, } from '@nagticketing/common';
import 'express-async-errors';

import { createTicketRouter, showTicketRouter, updateTicketRouter } from './routes';


const app = express();
const PORT = 3000;

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true,
}));

app.use(currentUser);

app.use(showTicketRouter);
app.use(createTicketRouter);
app.use(updateTicketRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY)
    throw new Error("JWT_KEY is not defined");
  if (!process.env.MONGO_URI)
    throw new Error("MONGO_URI is not defined");

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch(err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Tickets service started on port ${PORT}`);
  });
};

start();