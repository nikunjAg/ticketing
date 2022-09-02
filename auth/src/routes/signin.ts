import express from 'express';

const router = express.Router();

router.post('/api/users/signin', (req, res, next) => {
  res.send('Hi there - SignIn');
});

export { router as signinRouter };