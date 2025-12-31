import express from 'express';
import { currentUser, requireAuth, requireParticipant } from '../../../common/src';
import { leaveTournamentController } from '../controllers/leave-tournament-controller';

const router = express.Router();

router.delete(
  '/api/participations/:tournamentId/leave',
  currentUser,
  requireAuth,
  requireParticipant,  // Only participants can leave tournaments
  leaveTournamentController
);

export { router as leaveTournamentRouter };
