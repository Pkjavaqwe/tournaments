import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ParticipationRequest } from '../entities/participation-request';
import { Tournament } from '../entities/tournament';
import { NotFoundError, NotAuthorizedError, BadRequestError, ParticipationStatus } from '../../../common/src';
import { ParticipationApprovedPublisher } from '../events/publishers/participation-approved-publisher';
import { natsWrapper } from '../nats-wrapper';

export const approveRequestController = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const organizerId = req.currentUser!.id;
console.log('Approve request id:',requestId);
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
  
  if (!tournament) {
    throw new BadRequestError('Tournament not found');
  }

  if (tournament.currentParticipants >= tournament.maxParticipants) {
    throw new BadRequestError('Tournament is full');
  }

  participationRequest.status = ParticipationStatus.APPROVED;
  await requestRepo.save(participationRequest);

  await new ParticipationApprovedPublisher(natsWrapper.client).publish({
    id: participationRequest.id,
    tournamentId: participationRequest.tournamentId,
    tournamentTitle: tournament.title,
    participantId: participationRequest.participantId,
    participantEmail: participationRequest.participantEmail,
    organizerId: participationRequest.organizerId,
    version: participationRequest.version,
  });

  res.send({
    message: 'Request approved successfully',
    request: participationRequest,
  });
};
