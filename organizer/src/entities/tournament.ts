import {
  Entity,
  PrimaryColumn,
  Column,
  VersionColumn,
} from 'typeorm';

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
