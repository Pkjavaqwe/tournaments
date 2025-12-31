import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import { ParticipationStatus } from '../../../common/src';

@Entity('participations')
@Unique(['tournamentId', 'participantId'])
export class Participation {
  @PrimaryGeneratedColumn('uuid')
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

  // Version for optimistic concurrency control
  @VersionColumn()
  version!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
