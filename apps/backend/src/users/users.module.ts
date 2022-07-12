import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from './entity/user.entity';
import { TokenService } from './token.service';
import { UserService } from './user.service';
import { AuthUserService } from './auth.user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [],
  providers: [TokenService, UserService, AuthUserService],
})
export class UsersModule {}
