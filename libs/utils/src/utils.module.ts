import { Module } from '@nestjs/common';
import { BearerStrategy } from './strategy/bearer.strategy';

@Module({
  providers: [BearerStrategy],
  exports: [BearerStrategy],
})
export class UtilsModule {}
