import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ParticipationRequest } from '../entities/participation-request';
import { Tournament } from '../entities/tournament';
import { NotFoundError, NotAuthorizedError, BadRequestError, ParticipationStatus } from '../../../common/src';
import { ParticipationRejectedPublisher } from '../events/publishers/participation-rejected-publisher';
import { natsWrapper } from '../nats-wrapper';

export const rejectRequestController = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { reason } = req.body;
  const organizerId = req.currentUser!.id;

  const requestRepo = AppDataSource.getRepository(ParticipationRequest);
  const tournamentRepo = AppDataSource.getRepository(Tournament);

  const participationRequest = await requestRepo.findOne({ where: { id: requestId } });

  if (!participationRequest) {
    throw new NotFoundError();
  }

  if (participationRequest.organizerId !== organizerId) {
    throw new NotAuthorizedError();
  }

  if (participationRequest.status !== ParticipationStatus.PENDING) {
    throw new BadRequestError('This request has already been processed');
  }

  const tournament = await tournamentRepo.findOne({ where: { id: participationRequest.tournamentId } });
  const tournamentTitle = tournament?.title || 'Unknown Tournament';

  participationRequest.status = ParticipationStatus.REJECTED;
  await requestRepo.save(participationRequest);

  await new ParticipationRejectedPublisher(natsWrapper.client).publish({
    id: participationRequest.id,
    tournamentId: participationRequest.tournamentId,
    tournamentTitle,
    participantId: participationRequest.participantId,
    participantEmail: participationRequest.participantEmail,
    organizerId: participationRequest.organizerId,
    reason,
    version: participationRequest.version,
  });

  res.send({
    message: 'Request rejected',
    request: participationRequest,
  });
};
