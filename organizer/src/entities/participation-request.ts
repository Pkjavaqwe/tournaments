import {
  Entity,
  PrimaryColumn,
  Column,
  VersionColumn,
  CreateDateColumn,
} from 'typeorm';
import { ParticipationStatus } from '../../../common/src';

/**
 * Local replica of participation requests
 * Organizer service needs to see pending requests for their tournaments
 */
@Entity('participation_requests')
export class ParticipationRequest {
  @PrimaryColumn()
  id!: string;

  @Column()
  tournamentId!: string;

  @Column()
  participantId!: string;

  @Column()
  participantEmail!: string;

  @Column()
  organizerId!: string;

  @Column({
    type: 'enum',
    enum: ParticipationStatus,
    default: ParticipationStatus.PENDING,
  })
  status!: ParticipationStatus;

  @VersionColumn()
  version!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
