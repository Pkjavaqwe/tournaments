import express from 'express';
import { currentUser, requireAuth, requireOrganizer } from '../../../common/src';
import { deleteTournamentController } from '../controllers/delete-tournament-controller';

const router = express.Router();

router.delete(
  '/api/tournaments/:id',
  currentUser,
  requireAuth,
  requireOrganizer,  // Only organizers can delete tournaments
  deleteTournamentController
);

export { router as deleteTournamentRouter };
