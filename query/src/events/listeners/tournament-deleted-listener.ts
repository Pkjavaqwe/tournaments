import { Message } from 'node-nats-streaming';
import { Listener, Subjects, TournamentDeletedEvent } from '../../../../common/src';
import { AppDataSource } from '../../config/database';
import { Tournament } from '../../entities/tournament';
import { queueGroupName } from './queue-group-name';

export class TournamentDeletedListener extends Listener<TournamentDeletedEvent> {
  readonly subject = Subjects.TournamentDeleted;
  queueGroupName = queueGroupName;

  async onMessage(data: TournamentDeletedEvent['data'], msg: Message) {
    const { id } = data;

    const tournamentRepo = AppDataSource.getRepository(Tournament);

    try {
      await tournamentRepo.delete({ id });
      msg.ack();
    } catch (err) {
      console.error('Error deleting tournament from query db:', err);
    }
  }
}
