import express from 'express';
import { body } from 'express-validator';
import { validateRequest, currentUser, requireAuth, requireOrganizer } from '../../../common/src';
import { createTournamentController } from '../controllers/create-tournament-controller';

const router = express.Router();

router.post(
  '/api/tournaments',
  currentUser,
  requireAuth,
  requireOrganizer,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
    body('maxParticipants')
      .isInt({ gt: 0 })
      .withMessage('Max participants must be greater than 0'),
  ],
  validateRequest,
  createTournamentController
);

export { router as createTournamentRouter };
