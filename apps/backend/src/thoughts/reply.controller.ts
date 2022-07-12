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
import { CreateReplyDto, PaginationDto } from './dto';
import { RepliesService } from './replies.service';
import { createReply, deleteReply, findAllReplies } from './schemas';

@ApiBearerAuth()
@ApiTags('reply')
@Controller('thoughts')
export class ReplyController {
  constructor(public repliesService: RepliesService) {}

  @Post(':id/reply')
  @AuthValidate(createReply)
  async create(
    @User('user.id') user: number,
    @User('ability') ability: AppAbility,
    @Param('id') id: number,
    @Body() createReplyDto: CreateReplyDto
  ) {
    if (!ability.can('create', 'replies')) {
      throw new ForbiddenException(
        'You are not authorized to perform this action'
      );
    }
    return this.repliesService.create(id, user, createReplyDto);
  }

  @Get(':id/reply')
  @AuthValidate(findAllReplies)
  async findAll(
    @User('user.id') userId: number,
    @User('ability') ability: AppAbility,
    @Param('id') id: number,
    @Query() { latest, offset, limit }: PaginationDto
  ) {
    if (!ability.can('read', 'replies')) {
      throw new ForbiddenException(
        'You are not authorized to perform this action'
      );
    }

    const { replies, count } = await this.repliesService.findAll(id, {
      latest,
      offset,
      limit,
    });

    return {
      replies: replies.map((r) => {
        const reply = r;
        if (reply.isAnonymous && reply.user.id !== userId) {
          delete reply.user;
        }
        return reply;
      }),
      count,
    };
  }

  @Delete(':id/reply/:replyId')
  @AuthValidate(deleteReply)
  async remove(
    @User('ability') ability: AppAbility,
    @Param('id') id: number,
    @Param('replyId') replyId: number
  ) {
    const reply = await this.repliesService.findOne(replyId);

    if (!ability.can('delete', subject('replies', reply))) {
      throw new ForbiddenException(
        'You are not authorized to perform this action'
      );
    }

    return this.repliesService.remove(id, replyId);
  }
}
