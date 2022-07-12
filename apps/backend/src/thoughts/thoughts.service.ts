import { MoreThan, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from '../users/user.service';

import { Thought } from './entity';
import { CreateThoughtDto, PaginationDto } from './dto';

@Injectable()
export class ThoughtsService {
  constructor(
    @InjectRepository(Thought) private thoughtsRepo: Repository<Thought>,
    public userService: UserService
  ) {}

  async create(userId: number, createThoughtDto: CreateThoughtDto) {
    const user = await this.userService.findOne(userId);

    const postEntity = this.thoughtsRepo.create({
      ...createThoughtDto,
      user,
    });

    const { id } = await this.thoughtsRepo.save(postEntity);

    return { id };
  }

  async findAll(
    { latest, offset, limit }: PaginationDto = {
      latest: true,
      limit: 10,
      offset: 0,
    }
  ) {
    const data = await this.thoughtsRepo
      .createQueryBuilder('thoughts')
      .select(['thoughts', 'user.id', 'user.username'])
      .where('thoughts.id > :id', { id: offset })
      .innerJoin('thoughts.user', 'user')
      .orderBy('thoughts.createdAt', latest ? 'DESC' : 'ASC')
      .limit(limit)
      .getMany();

    if (!data) {
      throw new NotFoundException({
        message: 'Thoughts not found.',
      });
    }

    const count = await this.thoughtsRepo.count({
      where: {
        id: MoreThan(offset),
      },
    });

    return {
      thoughts: data,
      count,
    };
  }

  async findOne(id: number) {
    const data = await this.thoughtsRepo
      .createQueryBuilder('thoughts')
      .select(['thoughts', 'user.id', 'user.username'])
      .where('thoughts.id = :id', { id })
      .innerJoin('thoughts.user', 'user')
      .getOne();

    if (!data) {
      throw new NotFoundException({
        message: 'Thought not found.',
      });
    }

    return data;
  }

  async findByUser(
    userId: number,
    {
      anonymous,
      latest,
      offset,
      limit,
    }: PaginationDto & { anonymous: boolean } = {
      anonymous: false,
      latest: true,
      limit: 10,
      offset: 0,
    }
  ) {
    const user = await this.userService.findOne(userId);

    const data = await this.thoughtsRepo
      .createQueryBuilder('thoughts')
      .select(['thoughts', 'user.id', 'user.username'])
      .where('thoughts.id > :id', { id: offset })
      .andWhere('thoughts.user = :userId', { userId: user.id })
      .andWhere(!anonymous ? 'thoughts.isAnonymous = :anon' : '1 = 1', {
        anon: anonymous,
      })
      .innerJoin('thoughts.user', 'user')
      .orderBy('thoughts.createdAt', latest ? 'DESC' : 'ASC')
      .limit(limit)
      .getMany();

    if (!data) {
      throw new NotFoundException({
        message: 'Thoughts not found.',
      });
    }

    const count = await this.thoughtsRepo.count({
      where: {
        id: MoreThan(offset),
        user: { id: user.id },
      },
    });

    return { thoughts: data, count };
  }

  async remove(thoughtId: number) {
    const entity = await this.findOne(thoughtId);

    const { affected } = await this.thoughtsRepo.delete(entity.id);

    return { affected };
  }
}
