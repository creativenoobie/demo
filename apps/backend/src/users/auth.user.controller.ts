import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BearerGuard, User, Validate } from '@app/utils';

import { CreateUserDto } from './dto';
import { AuthUserService } from './auth.user.service';
import { LocalGuard, NoAuth } from './guards';
import { loginSchema, signupSchema } from './schemas';

@ApiBearerAuth()
@ApiTags('auth')
@Controller()
export class AuthUserController {
  constructor(public readonly authService: AuthUserService) {}

  @UseGuards(NoAuth)
  @Validate(signupSchema)
  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signup(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Validate(loginSchema)
  @Post('login')
  login(@Req() req: { user: { token: string } }) {
    return req.user.token;
  }

  @UseGuards(BearerGuard)
  @Get('logout')
  async logout(@User('token') token: string) {
    return this.authService.logout(token);
  }

  // TODO: Add forgotPassword and resetPassword functions
}
