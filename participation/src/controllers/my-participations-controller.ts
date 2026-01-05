import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Participation } from '../entities/participation';

export const myParticipationsController = async (req: Request, res: Response) => {
  const participantId = req.currentUser!.id;

  const participationRepo = AppDataSource.getRepository(Participation);
  const participations = await participationRepo.find({
    where: { participantId },
    relations: ['tournament'],
    order: { createdAt: 'DESC' },
  });

  res.send(participations);
};
