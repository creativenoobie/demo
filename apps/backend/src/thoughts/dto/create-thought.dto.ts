import { ApiProperty } from '@nestjs/swagger';

export class CreateThoughtDto {
  @ApiProperty()
  text: string;

  @ApiProperty()
  isAnonymous: boolean;
}
