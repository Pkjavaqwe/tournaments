import { Subjects } from '../subjects';

export interface TournamentUpdatedEvent {
  subject: Subjects.TournamentUpdated;
  data: {
    id: string;
    title: string;
    description: string;
    startDate: string;
    endDate: string;
    maxParticipants: number;
    currentParticipants: number;
    organizerId: string;
    version: number;
  };
}
