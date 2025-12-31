import { Message } from 'node-nats-streaming';
import { Listener, Subjects, ParticipationApprovedEvent, ParticipationStatus } from '../../../../common/src';
import { AppDataSource } from '../../config/database';
import { Participation } from '../../entities/participation';
import { queueGroupName } from './queue-group-name';

export class ParticipationApprovedListener extends Listener<ParticipationApprovedEvent> {
  readonly subject = Subjects.ParticipationApproved;
  queueGroupName = queueGroupName;

  async onMessage(data: ParticipationApprovedEvent['data'], msg: Message) {
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

    participation.status = ParticipationStatus.APPROVED;
    participation.version = version;

    try {
      await participationRepo.save(participation);
      msg.ack();
    } catch (err) {
      console.error('Error updating participation in query db:', err);
    }
  }
}
