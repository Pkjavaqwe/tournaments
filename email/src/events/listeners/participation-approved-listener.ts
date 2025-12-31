import { Message } from 'node-nats-streaming';
import { Listener, Subjects, ParticipationApprovedEvent } from '../../../../common/src';
import { queueGroupName } from './queue-group-name';
import { EmailService } from '../../services/email-service';

/**
 * Listens for participation approval and sends email to participant
 */
export class ParticipationApprovedListener extends Listener<ParticipationApprovedEvent> {
  readonly subject = Subjects.ParticipationApproved;
  queueGroupName = queueGroupName;

  async onMessage(data: ParticipationApprovedEvent['data'], msg: Message) {
    const { participantEmail, tournamentTitle } = data;

    try {
      await EmailService.sendApprovalEmail(participantEmail, tournamentTitle);
      msg.ack();
    } catch (err) {
      console.error('Error sending approval email:', err);
    }
  }
}
