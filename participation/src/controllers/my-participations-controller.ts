import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Participation } from '../entities/participation';

/**
 * Get my participations
 * Shows all tournaments user has joined or requested to join
 */
export const myParticipationsController = async (req: Request, res: Response) => {
  const participantId = req.currentUser!.id;

  const participationRepo = AppDataSource.getRepository(Participation);
  const participations = await participationRepo.find({
    where: { participantId },
    order: { createdAt: 'DESC' },
  });

  res.send(participations);
};
