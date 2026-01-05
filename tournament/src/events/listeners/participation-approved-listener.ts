import { Message } from 'node-nats-streaming';
import { Listener, Subjects, ParticipationApprovedEvent } from '../../../../common/src';
import { AppDataSource } from '../../config/database';
import { Tournament } from '../../entities/tournament';
import { queueGroupName } from './queue-group-name';
import { TournamentUpdatedPublisher } from '../publishers/tournament-updated-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class ParticipationApprovedListener extends Listener<ParticipationApprovedEvent> {
  readonly subject = Subjects.ParticipationApproved;
  queueGroupName = queueGroupName;

  async onMessage(data: ParticipationApprovedEvent['data'], msg: Message) {
    const { tournamentId } = data;

    const tournamentRepo = AppDataSource.getRepository(Tournament);
    const tournament = await tournamentRepo.findOne({ where: { id: tournamentId } });

    if (!tournament) {
      console.error(`Tournament not found: ${tournamentId}`);
      return;
    }

    tournament.currentParticipants += 1;
    
    try {
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

      msg.ack();
    } catch (err) {
      console.error('Error updating tournament:', err);
    }
  }
}
