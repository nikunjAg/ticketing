import express from 'express';

const router = express.Router();

router.post('/api/users/signup', (req, res, next) => {
  res.send('Hi there - SignOut');
});

export { router as signoutRouter };