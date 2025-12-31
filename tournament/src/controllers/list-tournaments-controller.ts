import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Tournament } from '../entities/tournament';

export const listTournamentsController = async (req: Request, res: Response) => {
  const tournamentRepo = AppDataSource.getRepository(Tournament);
  const tournaments = await tournamentRepo.find({
    order: { createdAt: 'DESC' },
  });

  res.send(tournaments);
};
