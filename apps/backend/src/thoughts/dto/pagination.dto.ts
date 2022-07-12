import { ApiProperty } from '@nestjs/swagger';

export class PaginationDto {
  @ApiProperty()
  offset: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  latest: boolean;
}
