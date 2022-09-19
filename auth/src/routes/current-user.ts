import express from 'express';
import { currentUser, requireAuth, } from '@nagticketing/common';


const router = express.Router();

router.get('/api/users/currentuser', currentUser, requireAuth, (req, res, next) => {
  res.json({ currentUser: req.currentUser });
});

export { router as currentUserRouter };