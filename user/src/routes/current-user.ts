import express from 'express';
import { currentUser } from '../../../common/src';
import { currentUserController } from '../controllers/current-user-controller';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, currentUserController);

export { router as currentUserRouter };
