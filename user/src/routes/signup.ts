import express from 'express';
import { body } from 'express-validator';
import { validateRequest, UserRole } from '../../../common/src';
import { signupController } from '../controllers/signup-controller';

const router = express.Router();

router.post(
  '/api/users/signup',
  [
    body('email').isEmail().withMessage('Email must be valid'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
    body('role')
      .optional()
      .isIn([UserRole.ORGANIZER, UserRole.PARTICIPANT])
      .withMessage('Role must be either organizer or participant'),
  ],
  validateRequest,
  signupController
);

export { router as signupRouter };
