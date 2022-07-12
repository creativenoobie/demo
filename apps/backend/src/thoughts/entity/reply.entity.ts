import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from '../../users/entity/user.entity';
import { Thought } from './thought.entity';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => User)
  user: User;

  @Index()
  @ManyToOne(() => Thought)
  thought: User;

  @Column('longtext')
  text: string;

  @Column({ default: false })
  isAnonymous: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
