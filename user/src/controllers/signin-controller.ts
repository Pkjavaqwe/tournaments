import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/user';
import { BadRequestError } from '../../../common/src';

export const signinController = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userRepo = AppDataSource.getRepository(User);
  const existingUser = await userRepo.findOne({ where: { email } });

  if (!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordsMatch = await existingUser.comparePassword(password);

  if (!passwordsMatch) {
    throw new BadRequestError('Invalid credentials');
  }

  const userJwt = jwt.sign(
    { id: existingUser.id, email: existingUser.email, role: existingUser.role },
    process.env.JWT_KEY!
  );

  req.session = { jwt: userJwt };

  res.status(200).send({
    id: existingUser.id,
    email: existingUser.email,
    role: existingUser.role,
  });
};
