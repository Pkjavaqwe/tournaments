import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TournamentCreatedEvent } from '../../../../common/src';
import { AppDataSource } from '../../config/database';
import { Tournament } from '../../entities/tournament';
import { queueGroupName } from './queue-group-name';

export class TournamentCreatedListener extends Listener<TournamentCreatedEvent> {
  readonly subject = Subjects.TournamentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TournamentCreatedEvent['data'], msg: Message) {
    const { id, title, description, startDate, endDate, maxParticipants, currentParticipants, organizerId, version } = data;

    const tournamentRepo = AppDataSource.getRepository(Tournament);
    
    const tournament = tournamentRepo.create({
      id,
      title,
      description,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      maxParticipants,
      currentParticipants,
      organizerId,
      version,
    });

    try {
      await tournamentRepo.save(tournament);
      msg.ack();
    } catch (err) {
      console.error('Error saving tournament to query db:', err);
    }
  }
}
