import {
  Entity,
  PrimaryColumn,
  Column,
  VersionColumn,
} from 'typeorm';
import { UserRole } from '../../../common/src';

@Entity('users')
export class User {
  @PrimaryColumn()
  id!: string;

  @Column()
  email!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role!: UserRole;

  @VersionColumn()
  version!: number;
}
