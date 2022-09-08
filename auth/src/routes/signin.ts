import express, { Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { BadRequestError } from '../errors';

import { validateRequest } from '../middlewares';
import { User } from '../models';
import { Password } from '../utils';

const router = express.Router();

router.post('/api/users/signin',
  [
    body('email')
      .isEmail()
      .withMessage("Invalid Email"),
    body('password')
      .trim()
      .notEmpty()
      .withMessage("Please enter a password")
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    const matchedUser = await User.findOne({ email });
    if (!matchedUser) {
      throw new BadRequestError('Invalid credentials');
    }

    const passwordsMatch = await Password.compare(matchedUser.password, password);
    if (!passwordsMatch) {
      throw new BadRequestError('Invalid credentials');
    }

    const userJwt = jwt.sign(
      {
        id: matchedUser.id,
        email: matchedUser.email
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt
    };

    res.status(200).json(matchedUser);
  }
);

export { router as signinRouter };