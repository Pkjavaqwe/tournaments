import express from 'express';
import { listUsersController } from '../controllers/list-users-controller';

const router = express.Router();

// Public endpoint - view users (for debugging/POC)
router.get('/api/query/users', listUsersController);

export { router as listUsersRouter };
