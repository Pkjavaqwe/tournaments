import express from 'express';
import { currentUser, requireAuth, requireOrganizer } from '../../../common/src';
import { approveRequestController } from '../controllers/approve-request-controller';

const router = express.Router();

router.post(
  '/api/organizer/requests/:requestId/approve',
  currentUser,
  requireAuth,
  requireOrganizer,
  approveRequestController
);

export { router as approveRequestRouter };
