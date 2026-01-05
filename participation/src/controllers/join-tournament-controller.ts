import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Participation } from '../entities/participation';
import { Tournament } from '../entities/tournament';
import { BadRequestError, NotFoundError, ParticipationStatus } from '../../../common/src';
import { ParticipationRequestedPublisher } from '../events/publishers/participation-requested-publisher';
import { natsWrapper } from '../nats-wrapper';

export const joinTournamentController = async (req: Request, res: Response) => {
  const { tournamentId } = req.body;
  const participantId = req.currentUser!.id;
  const participantEmail = req.currentUser!.email;

  const tournamentRepo = AppDataSource.getRepository(Tournament);
  const participationRepo = AppDataSource.getRepository(Participation);

  const tournament = await tournamentRepo.findOne({ where: { id: tournamentId } });
  
  if (!tournament) {
    throw new NotFoundError();
  }

  const existingParticipation = await participationRepo.findOne({
    where: { tournamentId, participantId },
  });

  if (existingParticipation) {
    if (existingParticipation.status === ParticipationStatus.PENDING) {
      throw new BadRequestError('You already have a pending request for this tournament');
    }
    if (existingParticipation.status === ParticipationStatus.APPROVED) {
      throw new BadRequestError('You are already a participant in this tournament');
    }
    if (existingParticipation.status === ParticipationStatus.REJECTED) {
      throw new BadRequestError('Your previous request was rejected');
    }
  }

  if (tournament.currentParticipants >= tournament.maxParticipants) {
    throw new BadRequestError('Tournament is full');
  }

  const participation = participationRepo.create({
    tournamentId,
    participantId,
    participantEmail,
    organizerId: tournament.organizerId,
    status: ParticipationStatus.PENDING,
  });

  await participationRepo.save(participation);

  await new ParticipationRequestedPublisher(natsWrapper.client).publish({
    id: participation.id,
    tournamentId,
    participantId,
    participantEmail,
    organizerId: tournament.organizerId,
    version: participation.version,
  });

  res.status(201).send({
    message: 'Join request submitted. Waiting for organizer approval.',
    participation,
  });
};
