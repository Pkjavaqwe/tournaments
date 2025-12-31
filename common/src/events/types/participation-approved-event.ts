import { Subjects } from '../subjects';

export interface ParticipationApprovedEvent {
  subject: Subjects.ParticipationApproved;
  data: {
    id: string;
    tournamentId: string;
    tournamentTitle: string;
    participantId: string;
    participantEmail: string;
    organizerId: string;
    version: number;
  };
}
