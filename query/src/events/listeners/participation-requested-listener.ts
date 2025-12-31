import { Message } from 'node-nats-streaming';
import { Listener, Subjects, ParticipationRequestedEvent, ParticipationStatus } from '../../../../common/src';
import { AppDataSource } from '../../config/database';
import { Participation } from '../../entities/participation';
import { queueGroupName } from './queue-group-name';

export class ParticipationRequestedListener extends Listener<ParticipationRequestedEvent> {
  readonly subject = Subjects.ParticipationRequested;
  queueGroupName = queueGroupName;

  async onMessage(data: ParticipationRequestedEvent['data'], msg: Message) {
    const { id, tournamentId, participantId, participantEmail, organizerId, version } = data;

    const participationRepo = AppDataSource.getRepository(Participation);
    
    const participation = participationRepo.create({
      id,
      tournamentId,
      participantId,
      participantEmail,
      organizerId,
      status: ParticipationStatus.PENDING,
      version,
    });

    try {
      await participationRepo.save(participation);
      msg.ack();
    } catch (err) {
      console.error('Error saving participation to query db:', err);
    }
  }
}
