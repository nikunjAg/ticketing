import express from "express";
import { json } from 'body-parser';
import mongoose from "mongoose";
import 'express-async-errors';

import {
  currentUserRouter,
  signupRouter,
  signinRouter,
  signoutRouter
} from './routes';
import { NotFoundError } from './errors';
import { errorHandler } from './middlewares';

const app = express();
const PORT = 3000;
const DB_NAME = 'auth';
const DB_URL = `mongodb://auth-mongo-srv:27017/${DB_NAME}`;

app.use(json());
app.use(currentUserRouter);
app.use(signupRouter);
app.use(signinRouter);
app.use(signoutRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to MongoDB');
  } catch(err) {
    console.error(err);
  }

  app.listen(PORT, () => {
    console.log(`Auth service started on port ${PORT}`);
  });
};

start();