import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ParticipationRequest } from '../entities/participation-request';
import { ParticipationStatus } from '../../../common/src';

export const pendingRequestsController = async (req: Request, res: Response) => {
  const organizerId = req.currentUser!.id;

  const requestRepo = AppDataSource.getRepository(ParticipationRequest);
  const requests = await requestRepo.find({
    where: {
      organizerId,
      status: ParticipationStatus.PENDING,
    },
    order: { createdAt: 'DESC' },
  });

  res.send(requests);
};
