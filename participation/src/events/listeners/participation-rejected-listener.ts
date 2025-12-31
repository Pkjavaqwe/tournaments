import { Message } from 'node-nats-streaming';
import { Listener, Subjects, ParticipationRejectedEvent, ParticipationStatus } from '../../../../common/src';
import { AppDataSource } from '../../config/database';
import { Participation } from '../../entities/participation';
import { queueGroupName } from './queue-group-name';

/**
 * Updates participation status when organizer rejects
 */
export class ParticipationRejectedListener extends Listener<ParticipationRejectedEvent> {
  readonly subject = Subjects.ParticipationRejected;
  queueGroupName = queueGroupName;

  async onMessage(data: ParticipationRejectedEvent['data'], msg: Message) {
    const { id, version } = data;

    const participationRepo = AppDataSource.getRepository(Participation);
    const participation = await participationRepo.findOne({ where: { id } });

    if (!participation) {
      console.error(`Participation not found: ${id}`);
      return;
    }

    // Optimistic concurrency check
    if (participation.version !== version - 1) {
      console.log(`Version mismatch for participation ${id}`);
      return;
    }

    participation.status = ParticipationStatus.REJECTED;
    participation.version = version;

    try {
      await participationRepo.save(participation);
      msg.ack();
    } catch (err) {
      console.error('Error updating participation:', err);
    }
  }
}
