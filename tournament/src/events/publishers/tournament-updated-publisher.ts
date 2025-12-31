import { Publisher, Subjects, TournamentUpdatedEvent } from '../../../../common/src';

export class TournamentUpdatedPublisher extends Publisher<TournamentUpdatedEvent> {
  readonly subject = Subjects.TournamentUpdated;
}
