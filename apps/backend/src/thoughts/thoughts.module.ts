import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../users/user.service';

import { Thought } from './entity/thought.entity';
import { ThoughtsService } from './thoughts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Thought])],
  controllers: [],
  providers: [UserService, ThoughtsService],
})
export class ThoughtsModule {}
