import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TournamentUpdatedEvent } from '../../../../common/src';
import { AppDataSource } from '../../config/database';
import { Tournament } from '../../entities/tournament';
import { queueGroupName } from './queue-group-name';

export class TournamentUpdatedListener extends Listener<TournamentUpdatedEvent> {
  readonly subject = Subjects.TournamentUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TournamentUpdatedEvent['data'], msg: Message) {
    const { id, title, description, startDate, endDate, maxParticipants, currentParticipants, organizerId, version } = data;

    const tournamentRepo = AppDataSource.getRepository(Tournament);
    const tournament = await tournamentRepo.findOne({ where: { id } });

    if (!tournament) {
      console.error(`Tournament not found: ${id}`);
      return;
    }

    // Optimistic concurrency check
    if (tournament.version !== version - 1) {
      console.log(`Version mismatch for tournament ${id}. Expected ${tournament.version + 1}, got ${version}`);
      return;
    }

    tournament.title = title;
    tournament.description = description;
    tournament.startDate = new Date(startDate);
    tournament.endDate = new Date(endDate);
    tournament.maxParticipants = maxParticipants;
    tournament.currentParticipants = currentParticipants;
    tournament.organizerId = organizerId;
    tournament.version = version;

    try {
      await tournamentRepo.save(tournament);
      msg.ack();
    } catch (err) {
      console.error('Error updating tournament in query db:', err);
    }
  }
}
