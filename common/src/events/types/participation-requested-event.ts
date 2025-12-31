import { Subjects } from '../subjects';

export interface ParticipationRequestedEvent {
  subject: Subjects.ParticipationRequested;
  data: {
    id: string;
    tournamentId: string;
    participantId: string;
    participantEmail: string;
    organizerId: string;
    version: number;
  };
}
