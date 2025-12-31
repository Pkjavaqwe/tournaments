import { Subjects } from '../subjects';

export interface TournamentCreatedEvent {
  subject: Subjects.TournamentCreated;
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
