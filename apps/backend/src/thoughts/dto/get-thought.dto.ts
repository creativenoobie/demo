import { ApiProperty } from '@nestjs/swagger';

export class GetThoughtDto {
  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  latest: boolean;
}
