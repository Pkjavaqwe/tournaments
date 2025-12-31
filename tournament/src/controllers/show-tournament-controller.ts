import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Tournament } from '../entities/tournament';
import { NotFoundError } from '../../../common/src';

export const showTournamentController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const tournamentRepo = AppDataSource.getRepository(Tournament);
  const tournament = await tournamentRepo.findOne({ where: { id } });

  if (!tournament) {
    throw new NotFoundError();
  }

  res.send(tournament);
};
