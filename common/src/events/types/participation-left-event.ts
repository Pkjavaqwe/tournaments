import { Subjects } from '../subjects';

export interface ParticipationLeftEvent {
  subject: Subjects.ParticipationLeft;
  data: {
    id: string;
    tournamentId: string;
    participantId: string;
    version: number;
  };
}
