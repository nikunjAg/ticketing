import express from 'express';
import jwt from 'jsonwebtoken';
import { body } from 'express-validator';
import { BadRequestError, validateRequest, } from '@nagticketing/common';

import { User } from '../models';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email')
      .isEmail()
      .withMessage("Invalid Email"),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password length must be between 4 and 20 charachters')
  ],
  validateRequest,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    // If User already exists with same email
    if (existingUser) {
      throw new BadRequestError("Email already in use");
    }
    
    const user = User.build({ email, password });
    const savedUser = await user.save();

    const userJwt = jwt.sign(
      {
        id: savedUser.id,
        email: savedUser.email
      },
      process.env.JWT_KEY!
    );

    req.session = {
      jwt: userJwt
    };

    res.status(201).json(savedUser);
  }
);

export { router as signupRouter };