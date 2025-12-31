import { Message } from 'node-nats-streaming';
import { Listener, Subjects, UserCreatedEvent } from '../../../../common/src';
import { AppDataSource } from '../../config/database';
import { User } from '../../entities/user';
import { queueGroupName } from './queue-group-name';

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent['data'], msg: Message) {
    const { id, email, role, version } = data;

    const userRepo = AppDataSource.getRepository(User);
    
    const user = userRepo.create({
      id,
      email,
      role,
      version,
    });

    try {
      await userRepo.save(user);
      msg.ack();
    } catch (err) {
      console.error('Error saving user to query db:', err);
    }
  }
}
