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

    if (!thought) {
      throw new NotFoundException({
        message: 'Thought not found.',
      });
    }

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
    const thought = await this.thoughtService.findOne(thoughtId);

    if (!thought) {
      throw new NotFoundException({
        message: 'Thought not found.',
      });
    }

    const data = await this.repliesRepo
      .createQueryBuilder('replies')
      .select(['replies', 'user.id', 'user.username'])
      .where('replies.id > :id', { id: offset })
      .andWhere('replies.thought = :thoughtId', { thoughtId: thought.id })
      .innerJoin('replies.user', 'user')
      .orderBy('replies.createdAt', latest ? 'DESC' : 'ASC')
      .limit(limit)
      .getMany();

    if (!data) {
      throw new NotFoundException({
        message: 'Replies not found.',
      });
    }

    const count = await this.repliesRepo.count({
      where: {
        id: MoreThan(offset),
        thought: { id: thought.id },
      },
    });

    return {
      replies: data,
      count,
    };
  }

  async findOne(id: number) {
    const data = await this.repliesRepo
      .createQueryBuilder('reply')
      .select(['reply', 'user.id', 'user.username'])
      .where('reply.id = :id', { id })
      .innerJoin('reply.user', 'user')
      .getOne();

    if (!data) {
      throw new NotFoundException({
        message: 'Reply not found.',
      });
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
        thought: {
          id: thought.id,
        },
      },
    });

    const { affected } = await this.repliesRepo.delete(entity.id);

    return { affected };
  }
}
