import {
  Entity,
  PrimaryColumn,
  Column,
  VersionColumn,
  OneToMany,
} from 'typeorm';
import { Participation } from './participation';

/**
 * Local replica of Tournament data
 * This is used to check if tournament has available slots
 * and to get organizer information
 * 
 * This pattern handles SERVICE OUTAGE:
 * - We keep a local copy of tournament data
 * - Even if tournament service is down, we can still process requests
 * - Data is kept in sync via event listeners
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

  @OneToMany(() => Participation, (participation) => participation.tournament)
  participations!: Participation[];
}
