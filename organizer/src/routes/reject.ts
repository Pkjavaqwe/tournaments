import express from 'express';
import { body } from 'express-validator';
import { currentUser, requireAuth, requireOrganizer, validateRequest } from '../../../common/src';
import { rejectRequestController } from '../controllers/reject-request-controller';

const router = express.Router();

router.post(
  '/api/organizer/requests/:requestId/reject',
  currentUser,
  requireAuth,
  requireOrganizer,
  [
    body('reason').optional().isString().withMessage('Reason must be a string'),
  ],
  validateRequest,
  rejectRequestController
);

export { router as rejectRequestRouter };
