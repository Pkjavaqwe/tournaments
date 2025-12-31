import express from 'express';
import { listTournamentsController } from '../controllers/list-tournaments-controller';

const router = express.Router();

// Public endpoint - anyone can view tournaments
router.get('/api/query/tournaments', listTournamentsController);

export { router as listTournamentsRouter };
