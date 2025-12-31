import {
  Entity,
  PrimaryColumn,
  Column,
  VersionColumn,
  CreateDateColumn,
} from 'typeorm';
import { ParticipationStatus } from '../../../common/src';

@Entity('participations')
export class Participation {
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
