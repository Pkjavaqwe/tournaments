import { Subjects } from '../subjects';

export interface EmailSentEvent {
  subject: Subjects.EmailSent;
  data: {
    to: string;
    subject: string;
    type: 'signup' | 'approval' | 'rejection';
    sentAt: string;
  };
}
