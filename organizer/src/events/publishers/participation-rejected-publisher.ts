import { Publisher, Subjects, ParticipationRejectedEvent } from '../../../../common/src';

export class ParticipationRejectedPublisher extends Publisher<ParticipationRejectedEvent> {
  readonly subject = Subjects.ParticipationRejected;
}
