import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { ParticipationRequest } from '../entities/participation-request';
import { Tournament } from '../entities/tournament';
import { NotFoundError, NotAuthorizedError, BadRequestError, ParticipationStatus } from '../../../common/src';
import { ParticipationApprovedPublisher } from '../events/publishers/participation-approved-publisher';
import { natsWrapper } from '../nats-wrapper';

/**
 * Approve a participation request
 * Only the organizer of the tournament can approve
 */
export const approveRequestController = async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const organizerId = req.currentUser!.id;

  const requestRepo = AppDataSource.getRepository(ParticipationRequest);
  const tournamentRepo = AppDataSource.getRepository(Tournament);

  const participationRequest = await requestRepo.findOne({ where: { id: requestId } });

  if (!participationRequest) {
    throw new NotFoundError();
  }

  // Check if current user is the organizer
  if (participationRequest.organizerId !== organizerId) {
    throw new NotAuthorizedError();
  }

  // Check if already processed
  if (participationRequest.status !== ParticipationStatus.PENDING) {
    throw new BadRequestError('This request has already been processed');
  }

  // Get tournament to check slots
  const tournament = await tournamentRepo.findOne({ where: { id: participationRequest.tournamentId } });
  
  if (!tournament) {
    throw new BadRequestError('Tournament not found');
  }

  // Check if tournament is full
  if (tournament.currentParticipants >= tournament.maxParticipants) {
    throw new BadRequestError('Tournament is full');
  }

  // Update status
  participationRequest.status = ParticipationStatus.APPROVED;
  await requestRepo.save(participationRequest);

  // Publish approval event
  // This will be picked up by:
  // - Tournament service (to increment participant count)
  // - Participation service (to update status)
  // - Email service (to send approval email)
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
