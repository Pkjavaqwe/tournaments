import express from 'express';
import { showTournamentController } from '../controllers/show-tournament-controller';

const router = express.Router();

router.get('/api/tournaments/:id', showTournamentController);

export { router as showTournamentRouter };
