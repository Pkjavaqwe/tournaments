import {
  Entity,
  PrimaryColumn,
  Column,
  VersionColumn,
} from 'typeorm';

/**
 * Local replica of Tournament data
 * Used to get tournament title for email notifications
 */
@Entity('tournaments')
export class Tournament {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column()
  maxParticipants!: number;

  @Column({ default: 0 })
  currentParticipants!: number;

  @Column()
  organizerId!: string;

  @VersionColumn()
  version!: number;
}
