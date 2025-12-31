import { Publisher, Subjects, UserCreatedEvent } from '../../../../common/src';

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}
