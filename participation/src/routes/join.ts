import express from 'express';
import { body } from 'express-validator';
import { validateRequest, currentUser, requireAuth, requireParticipant } from '../../../common/src';
import { joinTournamentController } from '../controllers/join-tournament-controller';

const router = express.Router();

router.post(
  '/api/participations/join',
  currentUser,
  requireAuth,
  requireParticipant,  // Only participants can join tournaments
  [
    body('tournamentId').notEmpty().withMessage('Tournament ID is required'),
  ],
  validateRequest,
  joinTournamentController
);

export { router as joinTournamentRouter };
