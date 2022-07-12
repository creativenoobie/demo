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
    @User('id') user: number,
    @Param('id') id: number,
    @Body() createReplyDto: CreateReplyDto
  ) {
    return this.repliesService.create(id, user, createReplyDto);
  }

  @Get(':id/reply')
  @AuthValidate(findAllReplies)
  async findAll(
    @User('id') userId: number,
    @Param('id') id: number,
    @Query() { latest, offset, limit }: PaginationDto
  ) {
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
  async remove(@Param('id') id: number, @Param('replyId') replyId: number) {
    return this.repliesService.remove(id, replyId);
  }
}
