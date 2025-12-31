import {
  Entity,
  PrimaryColumn,
  Column,
  VersionColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity('tournaments')
export class Tournament {
  @PrimaryColumn()
  id!: string;

  @Column()
  title!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column()
  startDate!: Date;

  @Column()
  endDate!: Date;

  @Column()
  maxParticipants!: number;

  @Column({ default: 0 })
  currentParticipants!: number;

  @Column()
  organizerId!: string;

  @VersionColumn()
  version!: number;

  @CreateDateColumn()
  createdAt!: Date;
}
