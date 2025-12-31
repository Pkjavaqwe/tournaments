import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Tournament } from '../entities/tournament';
import { NotFoundError, NotAuthorizedError } from '../../../common/src';
import { TournamentDeletedPublisher } from '../events/publishers/tournament-deleted-publisher';
import { natsWrapper } from '../nats-wrapper';

export const deleteTournamentController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const tournamentRepo = AppDataSource.getRepository(Tournament);
  const tournament = await tournamentRepo.findOne({ where: { id } });

  if (!tournament) {
    throw new NotFoundError();
  }

  // Only organizer who created this tournament can delete it
  if (tournament.organizerId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }

  await tournamentRepo.remove(tournament);

  // Publish event
  await new TournamentDeletedPublisher(natsWrapper.client).publish({
    id,
    organizerId: tournament.organizerId,
  });

  res.status(204).send();
};
