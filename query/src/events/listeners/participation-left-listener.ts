import { Message } from 'node-nats-streaming';
import { Listener, Subjects, ParticipationLeftEvent, ParticipationStatus } from '../../../../common/src';
import { AppDataSource } from '../../config/database';
import { Participation } from '../../entities/participation';
import { queueGroupName } from './queue-group-name';

export class ParticipationLeftListener extends Listener<ParticipationLeftEvent> {
  readonly subject = Subjects.ParticipationLeft;
  queueGroupName = queueGroupName;

  async onMessage(data: ParticipationLeftEvent['data'], msg: Message) {
    const { id, version } = data;

    const participationRepo = AppDataSource.getRepository(Participation);
    const participation = await participationRepo.findOne({ where: { id } });

    if (!participation) {
      console.error(`Participation not found: ${id}`);
      return;
    }

    if (participation.version !== version - 1) {
      console.log(`Version mismatch for participation ${id}`);
      return;
    }

    participation.status = ParticipationStatus.LEFT;
    participation.version = version;

    try {
      await participationRepo.save(participation);
      msg.ack();
    } catch (err) {
      console.error('Error updating participation in query db:', err);
    }
  }
}
