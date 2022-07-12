import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reply, Thought } from './entity';
import { ThoughtsService } from './thoughts.service';
import { RepliesService } from './replies.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Thought, Reply]), UsersModule],
  controllers: [],
  providers: [ThoughtsService, RepliesService],
})
export class ThoughtsModule {}
