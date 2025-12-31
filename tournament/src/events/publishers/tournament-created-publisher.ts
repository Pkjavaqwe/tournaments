import { Publisher, Subjects, TournamentCreatedEvent } from '../../../../common/src';

export class TournamentCreatedPublisher extends Publisher<TournamentCreatedEvent> {
  readonly subject = Subjects.TournamentCreated;
}
