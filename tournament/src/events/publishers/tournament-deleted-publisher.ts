import { Publisher, Subjects, TournamentDeletedEvent } from '../../../../common/src';

export class TournamentDeletedPublisher extends Publisher<TournamentDeletedEvent> {
  readonly subject = Subjects.TournamentDeleted;
}
