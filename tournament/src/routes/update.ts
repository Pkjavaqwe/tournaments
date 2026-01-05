import express from 'express';
import { body } from 'express-validator';
import { validateRequest, currentUser, requireAuth, requireOrganizer } from '../../../common/src';
import { updateTournamentController } from '../controllers/update-tournament-controller';

const router = express.Router();

router.put(
  '/api/tournaments/:id',
  currentUser,
  requireAuth,
  requireOrganizer,
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().notEmpty().withMessage('Description cannot be empty'),
    body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
    body('endDate').optional().isISO8601().withMessage('Valid end date is required'),
    body('maxParticipants')
      .optional()
      .isInt({ gt: 0 })
      .withMessage('Max participants must be greater than 0'),
  ],
  validateRequest,
  updateTournamentController
);

export { router as updateTournamentRouter };
