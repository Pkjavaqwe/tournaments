import { Publisher, Subjects, ParticipationApprovedEvent } from '../../../../common/src';

export class ParticipationApprovedPublisher extends Publisher<ParticipationApprovedEvent> {
  readonly subject = Subjects.ParticipationApproved;
}
