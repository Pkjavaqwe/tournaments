import {
  Entity,
  PrimaryColumn,
  Column,
  VersionColumn,
  OneToMany,
} from 'typeorm';
import { Participation } from './participation';

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
