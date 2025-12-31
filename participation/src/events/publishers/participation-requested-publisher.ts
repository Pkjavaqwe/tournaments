import { Publisher, Subjects, ParticipationRequestedEvent } from '../../../../common/src';

export class ParticipationRequestedPublisher extends Publisher<ParticipationRequestedEvent> {
  readonly subject = Subjects.ParticipationRequested;
}
