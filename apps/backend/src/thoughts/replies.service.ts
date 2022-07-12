import { MoreThan, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from '../users/user.service';

import { Reply } from './entity';
import { CreateReplyDto, PaginationDto } from './dto';
import { ThoughtsService } from './thoughts.service';

@Injectable()
export class RepliesService {
  constructor(
    @InjectRepository(Reply) private repliesRepo: Repository<Reply>,
    public userService: UserService,
    public thoughtService: ThoughtsService
  ) {}

  async create(
    thoughtId: number,
    userId: number,
    createReplyDto: CreateReplyDto
  ) {
    const thought = await this.thoughtService.findOne(thoughtId);
    const user = await this.userService.findOne(userId);

    const replyEntity = this.repliesRepo.create({
      ...createReplyDto,
      user,
      thought,
    });

    const { id } = await this.repliesRepo.save(replyEntity);

    return { id };
  }

  async findAll(
    thoughtId: number,
    { latest, offset, limit }: PaginationDto = {
      latest: true,
      limit: 10,
      offset: 0,
    }
  ) {
    const [data, count] = await this.repliesRepo.findAndCount({
      where: {
        id: MoreThan(offset),
      },
      relations: ['user'],
      order: {
        createdAt: latest ? 'DESC' : 'ASC',
      },
      take: limit,
    });

    return {
      replies: data,
      count,
    };
  }

  async findOne(id: number) {
    const data = await this.repliesRepo.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!data) {
      throw new NotFoundException({
        message: 'Reply not found.',
      });
    }

    if (data.isAnonymous) {
      delete data.user;
    }

    return data;
  }

  async remove(thoughtId: number, replyId: number) {
    const thought = await this.thoughtService.findOne(thoughtId);

    if (!thought) {
      throw new NotFoundException({
        message: 'Thought not found.',
      });
    }

    const entity = await this.repliesRepo.findOne({
      where: {
        id: replyId,
        thought,
      },
    });

    const { affected } = await this.repliesRepo.delete(entity);

    return { affected };
  }
}
