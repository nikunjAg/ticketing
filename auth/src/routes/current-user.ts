import express from 'express';

const router = express.Router();

router.get('/api/users/current-user', (req, res, next) => {
  res.send('Hi there');
});

export { router as currentUserRouter };