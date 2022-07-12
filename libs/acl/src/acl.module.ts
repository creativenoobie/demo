import { Module } from '@nestjs/common';
import { CaslAbilityFactory } from './casl';

@Module({
  providers: [CaslAbilityFactory],
  exports: [CaslAbilityFactory],
})
export class AclModule {}
