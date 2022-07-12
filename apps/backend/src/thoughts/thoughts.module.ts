import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Thought } from './entity/thought.entity';

import { ThoughtsService } from './thoughts.service';

@Module({
  imports: [TypeOrmModule.forFeature([Thought])],
  controllers: [],
  providers: [ThoughtsService],
})
export class ThoughtsModule {}
