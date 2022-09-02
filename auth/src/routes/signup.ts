import express from 'express';
import { body, validationResult } from 'express-validator';

import { RequestValidationError, DatabaseConnectionError } from '../errors';

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
  (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;

    console.log("Creating user with creds: ", email, password);
    throw new DatabaseConnectionError();

    res.status(201).json({
      status: 201,
      message: "User created successfully"
    });
  }
);

export { router as signupRouter };