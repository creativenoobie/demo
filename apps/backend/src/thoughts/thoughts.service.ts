import { MoreThan, Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from '../users/user.service';

import { Thought } from './entity/thought.entity';
import { CreateThoughtDto, GetThoughtDto } from './dto';

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
    { latest, offset, limit }: GetThoughtDto = {
      latest: true,
      limit: 10,
      offset: 0,
    }
  ) {
    const [data, count] = await this.thoughtsRepo.findAndCount({
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
      thoughts: data,
      count,
    };
  }

  async findOne(id: number) {
    const data = await this.thoughtsRepo.findOne({
      where: {
        id,
      },
      relations: ['user'],
    });

    if (!data) {
      throw new NotFoundException({
        message: 'Thought not found.',
      });
    }

    if (data.isAnonymous) {
      delete data.user;
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
    }: GetThoughtDto & { anonymous: boolean } = {
      anonymous: false,
      latest: true,
      limit: 10,
      offset: 0,
    }
  ) {
    const user = await this.userService.findOne(userId);

    const [data, count] = await this.thoughtsRepo.findAndCount({
      where: {
        id: MoreThan(offset),
        user,
        isAnonymous: anonymous,
      },
      order: {
        createdAt: latest ? 'DESC' : 'ASC',
      },
      take: limit,
    });

    return { thoughts: data, count };
  }

  async remove(thoughtId: number) {
    const entity = await this.findOne(thoughtId);

    const { affected } = await this.thoughtsRepo.delete(entity);

    return { affected };
  }
}
