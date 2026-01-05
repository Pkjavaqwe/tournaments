import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../entities/user';

export const listUsersController = async (req: Request, res: Response) => {
  const { role } = req.query;

  const userRepo = AppDataSource.getRepository(User);
  
  let query: any = {};
  if (role) {
    query.role = role;
  }

  const users = await userRepo.find({
    where: query,
    select: ['id', 'email', 'role'],
  });

  res.send(users);
};
