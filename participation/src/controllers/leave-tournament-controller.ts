import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Participation } from '../entities/participation';
import { BadRequestError, NotFoundError, ParticipationStatus } from '../../../common/src';
import { ParticipationLeftPublisher } from '../events/publishers/participation-left-publisher';
import { natsWrapper } from '../nats-wrapper';

export const leaveTournamentController = async (req: Request, res: Response) => {
  const { tournamentId } = req.params;
  const participantId = req.currentUser!.id;

  const participationRepo = AppDataSource.getRepository(Participation);

  const participation = await participationRepo.findOne({
    where: { tournamentId, participantId },
  });

  if (!participation) {
    throw new NotFoundError();
  }

  if (participation.status === ParticipationStatus.LEFT) {
    throw new BadRequestError('You have already left this tournament');
  }

  if (participation.status === ParticipationStatus.PENDING) {
    await participationRepo.remove(participation);
    
    res.send({ message: 'Join request cancelled' });
    return;
  }

  if (participation.status === ParticipationStatus.APPROVED) {
    participation.status = ParticipationStatus.LEFT;
    await participationRepo.save(participation);

    await new ParticipationLeftPublisher(natsWrapper.client).publish({
      id: participation.id,
      tournamentId,
      participantId,
      version: participation.version,
    });

    res.send({ message: 'Successfully left the tournament' });
    return;
  }

  throw new BadRequestError('Cannot leave tournament with current status');
};
