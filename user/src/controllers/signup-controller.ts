import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../entities/user';
import { BadRequestError, UserRole } from '../../../common/src';
import { UserCreatedPublisher } from '../events/publishers/user-created-publisher';
import { natsWrapper } from '../nats-wrapper';

export const signupController = async (req: Request, res: Response) => {
  const { email, password, role } = req.body;

  const userRepo = AppDataSource.getRepository(User);
  const existingUser = await userRepo.findOne({ where: { email } });

  if (existingUser) {
    throw new BadRequestError('Email in use');
  }

  // Validate role
  const userRole = role === UserRole.ORGANIZER ? UserRole.ORGANIZER : UserRole.PARTICIPANT;

  const user = userRepo.create({ email, password, role: userRole });
  await userRepo.save(user);

  // Generate JWT with role included
  const userJwt = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_KEY!
  );

  // Store it on session object
  req.session = { jwt: userJwt };

  // Publish user created event (for email service to send welcome email)
  await new UserCreatedPublisher(natsWrapper.client).publish({
    id: user.id,
    email: user.email,
    role: user.role,
    version: user.version,
  });

  res.status(201).send({
    id: user.id,
    email: user.email,
    role: user.role,
  });
};
