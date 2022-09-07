import express from 'express';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';

import { RequestValidationError, BadRequestError } from '../errors';
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
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

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