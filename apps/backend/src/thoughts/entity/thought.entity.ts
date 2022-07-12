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

@Entity()
export class Thought {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @ManyToOne(() => User)
  user: User;

  @Column('longtext')
  text: string;

  @Column({ default: false })
  isAnonymous: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
