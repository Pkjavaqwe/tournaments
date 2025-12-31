import { Message } from 'node-nats-streaming';
import { Listener, Subjects, ParticipationRequestedEvent, ParticipationStatus } from '../../../../common/src';
import { AppDataSource } from '../../config/database';
import { ParticipationRequest } from '../../entities/participation-request';
import { queueGroupName } from './queue-group-name';

/**
 * Listens for participation requests
 * Creates local replica for organizer to view and act on
 */
export class ParticipationRequestedListener extends Listener<ParticipationRequestedEvent> {
  readonly subject = Subjects.ParticipationRequested;
  queueGroupName = queueGroupName;

  async onMessage(data: ParticipationRequestedEvent['data'], msg: Message) {
    const { id, tournamentId, participantId, participantEmail, organizerId, version } = data;

    const requestRepo = AppDataSource.getRepository(ParticipationRequest);
    
    const request = requestRepo.create({
      id,
      tournamentId,
      participantId,
      participantEmail,
      organizerId,
      status: ParticipationStatus.PENDING,
      version,
    });

    try {
      await requestRepo.save(request);
      console.log(`New participation request: ${id} from ${participantEmail}`);
      msg.ack();
    } catch (err) {
      console.error('Error saving participation request:', err);
    }
  }
}
