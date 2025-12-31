import { Publisher, Subjects, ParticipationLeftEvent } from '../../../../common/src';

export class ParticipationLeftPublisher extends Publisher<ParticipationLeftEvent> {
  readonly subject = Subjects.ParticipationLeft;
}
