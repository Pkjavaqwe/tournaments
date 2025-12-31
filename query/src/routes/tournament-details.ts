import express from 'express';
import { tournamentDetailsController } from '../controllers/tournament-details-controller';

const router = express.Router();

// Public endpoint - anyone can view tournament details
router.get('/api/query/tournaments/:id', tournamentDetailsController);

export { router as tournamentDetailsRouter };
