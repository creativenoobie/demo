import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon2 from 'argon2';

import { UserService } from './user.service';
import { TokenService } from './token.service';

import { CreateUserDto, LoginUserDto } from './dto';

@Injectable()
export class AuthUserService {
  constructor(
    public readonly userService: UserService,
    public readonly tokenService: TokenService
  ) {}

  async signup(createUserDto: CreateUserDto) {
    const { password, ...params } = createUserDto;

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const entity = await this.userService.create({
      ...params,
      password: hashedPassword,
    });

    return this.tokenService.addData(entity.id);
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    const user = await this.userService.findOneBy({ username });

    if (!(await argon2.verify(user.password, password))) {
      throw new UnauthorizedException({
        message: 'Incorrect password.',
      });
    }

    return this.tokenService.addData(user.id);
  }

  async logout(token: string) {
    await this.tokenService.removeToken(token);
  }

  // TODO: Add forgotPassword and resetPassword functions
}
