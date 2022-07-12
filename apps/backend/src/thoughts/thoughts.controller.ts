import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthValidate } from '@app/utils';
import { AppAbility, User } from '@app/acl';

import { subject } from '@casl/ability';
import { CreateThoughtDto, PaginationDto } from './dto';
import { ThoughtsService } from './thoughts.service';
import {
  createThoughtSchema,
  deleteThoughtSchema,
  findAllThoughtsSchema,
  findByUserThoughtsSchema,
} from './schemas';

@ApiBearerAuth()
@ApiTags('thoughts')
@Controller('thoughts')
export class ThoughtsController {
  constructor(public thoughtService: ThoughtsService) {}

  @Post()
  @AuthValidate(createThoughtSchema)
  async create(
    @User('user.id') user: number,
    @User('ability') ability: AppAbility,
    @Body()
    createThoughtDto: CreateThoughtDto
  ) {
    if (!ability.can('create', 'thoughts')) {
      throw new ForbiddenException(
        'You are not authorized to perform this action'
      );
    }
    return this.thoughtService.create(user, createThoughtDto);
  }

  @Get()
  @AuthValidate(findAllThoughtsSchema)
  async findAll(
    @User('user.id') userId: number,
    @User('ability') ability: AppAbility,
    @Query() { latest, offset, limit }: PaginationDto
  ) {
    if (!ability.can('read', 'thoughts')) {
      throw new ForbiddenException(
        'You are not authorized to perform this action'
      );
    }

    const { thoughts, count } = await this.thoughtService.findAll({
      latest,
      offset,
      limit,
    });

    return {
      thoughts: thoughts.map((r) => {
        const thought = r;
        if (thought.isAnonymous && thought.user.id !== userId) {
          delete thought.user;
        }
        return thought;
      }),
      count,
    };
  }

  @Get('user/:id')
  @AuthValidate(findByUserThoughtsSchema)
  async findByUser(
    @User('user.id') user: number,
    @User('ability') ability: AppAbility,
    @Param('id') id: number,
    @Query()
    { latest, offset, limit }: PaginationDto
  ) {
    if (!ability.can('read', 'thoughts')) {
      throw new ForbiddenException(
        'You are not authorized to perform this action'
      );
    }
    return this.thoughtService.findByUser(id, {
      anonymous: id === user,
      latest,
      offset,
      limit,
    });
  }

  @Delete(':id')
  @AuthValidate(deleteThoughtSchema)
  async remove(@User('ability') ability: AppAbility, @Param('id') id: number) {
    const thought = await this.thoughtService.findOne(id);

    if (!ability.can('delete', subject('thoughts', thought))) {
      throw new ForbiddenException(
        'You are not authorized to perform this action'
      );
    }

    return this.thoughtService.remove(id);
  }
}
