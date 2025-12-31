import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Tournament } from '../entities/tournament';
import { TournamentCreatedPublisher } from '../events/publishers/tournament-created-publisher';
import { natsWrapper } from '../nats-wrapper';

export const createTournamentController = async (req: Request, res: Response) => {
  const { title, description, startDate, endDate, maxParticipants } = req.body;

  const tournamentRepo = AppDataSource.getRepository(Tournament);
  
  const tournament = tournamentRepo.create({
    title,
    description,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    maxParticipants,
    currentParticipants: 0,
    organizerId: req.currentUser!.id,
  });

  await tournamentRepo.save(tournament);

  // Publish event
  await new TournamentCreatedPublisher(natsWrapper.client).publish({
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

  res.status(201).send(tournament);
};
