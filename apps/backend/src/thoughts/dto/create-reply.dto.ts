import { ApiProperty } from '@nestjs/swagger';

export class CreateReplyDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  isAnonymous: boolean;
}
