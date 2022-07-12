import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from '../users/user.service';

import { Reply, Thought } from './entity';
import { ThoughtsService } from './thoughts.service';
import { RepliesService } from './replies.service';

@Module({
  imports: [TypeOrmModule.forFeature([Thought, Reply])],
  controllers: [],
  providers: [UserService, ThoughtsService, RepliesService],
})
export class ThoughtsModule {}
