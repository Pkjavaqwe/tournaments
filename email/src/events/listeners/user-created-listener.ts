import { Message } from 'node-nats-streaming';
import { Listener, Subjects, UserCreatedEvent } from '../../../../common/src';
import { queueGroupName } from './queue-group-name';
import { EmailService } from '../../services/email-service';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { email, role } = data;

    try {
      await EmailService.sendWelcomeEmail(email, role);
      msg.ack();
    } catch (err) {
      console.error('Error sending welcome email:', err);
    }
  }
}
