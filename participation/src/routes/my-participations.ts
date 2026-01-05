import express from 'express';
import { currentUser, requireAuth, requireParticipant } from '../../../common/src';
import { myParticipationsController } from '../controllers/my-participations-controller';

const router = express.Router();

router.get(
  '/api/participations/my',
  currentUser,
  requireAuth,
  requireParticipant,
  myParticipationsController
);

export { router as myParticipationsRouter };
