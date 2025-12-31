import { Subjects } from '../subjects';
import { UserRole } from '../../types/user-role';

export interface UserCreatedEvent {
  subject: Subjects.UserCreated;
  data: {
    id: string;
    email: string;
    role: UserRole;
    version: number;
  };
}
