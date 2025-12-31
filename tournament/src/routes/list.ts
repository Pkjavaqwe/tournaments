import express from 'express';
import { listTournamentsController } from '../controllers/list-tournaments-controller';

const router = express.Router();

// Anyone can list tournaments (public)
router.get('/api/tournaments', listTournamentsController);

export { router as listTournamentsRouter };
