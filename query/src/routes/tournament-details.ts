import express from 'express';
import { tournamentDetailsController } from '../controllers/tournament-details-controller';

const router = express.Router();

router.get('/api/query/tournaments/:id', tournamentDetailsController);

export { router as tournamentDetailsRouter };
