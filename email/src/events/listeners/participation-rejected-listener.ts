import { Message } from 'node-nats-streaming';
import { Listener, Subjects, ParticipationRejectedEvent } from '../../../../common/src';
import { queueGroupName } from './queue-group-name';
import { EmailService } from '../../services/email-service';

/**
 * Listens for participation rejection and sends email to participant
 */
export class ParticipationRejectedListener extends Listener<ParticipationRejectedEvent> {
  readonly subject = Subjects.ParticipationRejected;
  queueGroupName = queueGroupName;

  async onMessage(data: ParticipationRejectedEvent['data'], msg: Message) {
    const { participantEmail, tournamentTitle, reason } = data;

    try {
      await EmailService.sendRejectionEmail(participantEmail, tournamentTitle, reason);
      msg.ack();
    } catch (err) {
      console.error('Error sending rejection email:', err);
    }
  }
}
