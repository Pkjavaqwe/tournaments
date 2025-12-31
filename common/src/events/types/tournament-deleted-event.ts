import { Subjects } from '../subjects';

export interface TournamentDeletedEvent {
  subject: Subjects.TournamentDeleted;
  data: {
    id: string;
    organizerId: string;
  };
}
