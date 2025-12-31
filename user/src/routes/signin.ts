import express from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../../../common/src';
import { signinController } from '../controllers/signin-controller';

const router = express.Router();

router.post(
  '/api/users/signin',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password').trim().notEmpty().withMessage('You must supply a password'),
  ],
  validateRequest,
  signinController
);

export { router as signinRouter };
