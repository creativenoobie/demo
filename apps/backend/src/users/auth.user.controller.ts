import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BearerGuard, Validate } from '@app/utils';
import { User } from '@app/acl';

import { CreateUserDto, LoginUserDto } from './dto';
import { AuthUserService } from './auth.user.service';
import { LocalGuard, NoAuth } from './guards';
import { loginSchema, signupSchema } from './schemas';

@ApiTags('auth')
@Controller()
export class AuthUserController {
  constructor(public readonly authService: AuthUserService) {}

  @UseGuards(NoAuth)
  @Validate(signupSchema)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return { token: await this.authService.signup(createUserDto) };
  }

  @UseGuards(LocalGuard)
  @Validate(loginSchema)
  @Post('login')
  login(
    @Body() loginUserDto: LoginUserDto,
    @Req() req: { user: { token: string } }
  ) {
    return { token: req.user.token };
  }

  @UseGuards(BearerGuard)
  @ApiBearerAuth()
  @Get('logout')
  async logout(@User('user.token') token: string) {
    return this.authService.logout(token);
  }

  // TODO: Add forgotPassword and resetPassword functions
}
