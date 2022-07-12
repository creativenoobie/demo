import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Thought } from './entity/thought.entity';

@Injectable()
export class ThoughtsService {
  constructor(
    @InjectRepository(Thought) private thoughtsRepo: Repository<Thought>
  ) {}
}
