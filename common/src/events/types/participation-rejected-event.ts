import { Subjects } from '../subjects';

export interface ParticipationRejectedEvent {
  subject: Subjects.ParticipationRejected;
  data: {
    id: string;
    tournamentId: string;
    tournamentTitle: string;
    participantId: string;
    participantEmail: string;
    organizerId: string;
    reason?: string;
    version: number;
  };
}
