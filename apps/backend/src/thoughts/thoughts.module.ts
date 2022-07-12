import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Reply, Thought } from './entity';
import { ThoughtsService } from './thoughts.service';
import { RepliesService } from './replies.service';
import { UsersModule } from '../users/users.module';
import { ThoughtsController } from './thoughts.controller';
import { ReplyController } from './reply.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Thought, Reply]), UsersModule],
  controllers: [ThoughtsController, ReplyController],
  providers: [ThoughtsService, RepliesService],
})
export class ThoughtsModule {}
