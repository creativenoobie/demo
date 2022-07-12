import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { AuthValidate, User } from '@app/utils';

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
    @User('id') user: number,
    @Body() createThoughtDto: CreateThoughtDto
  ) {
    return this.thoughtService.create(user, createThoughtDto);
  }

  @Get()
  @AuthValidate(findAllThoughtsSchema)
  async findAll(
    @User('id') userId: number,
    @Query() { latest, offset, limit }: PaginationDto
  ) {
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
    @User('id') user: number,
    @Param('id') id: number,
    @Query()
    { latest, offset, limit }: PaginationDto
  ) {
    return this.thoughtService.findByUser(id, {
      anonymous: id === user,
      latest,
      offset,
      limit,
    });
  }

  @Delete(':id')
  @AuthValidate(deleteThoughtSchema)
  async remove(@Param('id') id: number) {
    return this.thoughtService.remove(id);
  }
}
