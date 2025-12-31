import express from 'express';
import { currentUser, requireAuth, requireOrganizer } from '../../../common/src';
import { pendingRequestsController } from '../controllers/pending-requests-controller';

const router = express.Router();

router.get(
  '/api/organizer/requests',
  currentUser,
  requireAuth,
  requireOrganizer,  // Only organizers can view requests
  pendingRequestsController
);

export { router as pendingRequestsRouter };
