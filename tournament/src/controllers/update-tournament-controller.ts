import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Tournament } from '../entities/tournament';
import { NotFoundError, NotAuthorizedError } from '../../../common/src';
import { TournamentUpdatedPublisher } from '../events/publishers/tournament-updated-publisher';
import { natsWrapper } from '../nats-wrapper';

export const updateTournamentController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, startDate, endDate, maxParticipants } = req.body;

  const tournamentRepo = AppDataSource.getRepository(Tournament);
  const tournament = await tournamentRepo.findOne({ where: { id } });

  if (!tournament) {
    throw new NotFoundError();
  }

  if (tournament.organizerId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  tournament.title = title || tournament.title;
  tournament.description = description || tournament.description;
  tournament.startDate = startDate ? new Date(startDate) : tournament.startDate;
  tournament.endDate = endDate ? new Date(endDate) : tournament.endDate;
  tournament.maxParticipants = maxParticipants || tournament.maxParticipants;

  await tournamentRepo.save(tournament);

  await new TournamentUpdatedPublisher(natsWrapper.client).publish({
    id: tournament.id,
    title: tournament.title,
    description: tournament.description,
    startDate: tournament.startDate.toISOString(),
    endDate: tournament.endDate.toISOString(),
    maxParticipants: tournament.maxParticipants,
    currentParticipants: tournament.currentParticipants,
    organizerId: tournament.organizerId,
    version: tournament.version,
  });

  res.send(tournament);
};
