import express from 'express';
import jwt from 'jsonwebtoken';

import { currentUser, requireAuth } from '../middlewares';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res, next) => {
  res.json({ currentUser: req.currentUser });
});

export { router as currentUserRouter };