import { Repository } from 'typeorm';

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entity/user.entity';

import { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

  async create(createUserDto: CreateUserDto) {
    const entity = this.userRepo.create(createUserDto);
    return this.userRepo.save(entity);
  }

  async findOne(id: number) {
    const data = await this.userRepo.findOneBy({ id });

    if (!data) {
      throw new NotFoundException({
        message: 'User not found.',
      });
    }

    return data;
  }

  async findOneBy(
    condition: { email: string } | { username: string }
  ): Promise<User> {
    const data = await this.userRepo.findOneBy({
      ...condition,
    });

    if (!data) {
      throw new NotFoundException({
        message: 'User not found.',
      });
    }

    return data;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const results = await this.userRepo.update(id, updateUserDto);

    if (!results.affected) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    return results;
  }

  async remove(id: number) {
    const userEntity = await this.userRepo.findOneBy({ id });

    if (!userEntity) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    const { affected } = await this.userRepo.delete(userEntity);

    return { affected };
  }
}
