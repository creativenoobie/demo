import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProfileInterface } from '../interfaces/profile.interface';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column('varchar', { length: 255 })
  username: string;

  @Column('varchar')
  password: string;

  @Index({ unique: true })
  @Column('varchar')
  email: string;

  @Column('json')
  profile: ProfileInterface;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
