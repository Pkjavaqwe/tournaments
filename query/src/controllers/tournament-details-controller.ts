import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Tournament } from '../entities/tournament';
import { Participation } from '../entities/participation';
import { User } from '../entities/user';
import { NotFoundError, ParticipationStatus } from '../../../common/src';

/**
 * Get tournament details with participants
 * This is a denormalized view combining data from multiple services
 */
export const tournamentDetailsController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const tournamentRepo = AppDataSource.getRepository(Tournament);
  const participationRepo = AppDataSource.getRepository(Participation);
  const userRepo = AppDataSource.getRepository(User);

  const tournament = await tournamentRepo.findOne({ where: { id } });

  if (!tournament) {
    throw new NotFoundError();
  }

  // Get organizer info
  const organizer = await userRepo.findOne({ where: { id: tournament.organizerId } });

  // Get approved participants
  const approvedParticipations = await participationRepo.find({
    where: {
      tournamentId: id,
      status: ParticipationStatus.APPROVED,
    },
  });

  // Get pending requests count (for organizer view)
  const pendingCount = await participationRepo.count({
    where: {
      tournamentId: id,
      status: ParticipationStatus.PENDING,
    },
  });

  res.send({
    ...tournament,
    organizer: organizer ? { id: organizer.id, email: organizer.email } : null,
    participants: approvedParticipations.map(p => ({
      id: p.participantId,
      email: p.participantEmail,
      joinedAt: p.createdAt,
    })),
    pendingRequestsCount: pendingCount,
    availableSlots: tournament.maxParticipants - tournament.currentParticipants,
  });
};
