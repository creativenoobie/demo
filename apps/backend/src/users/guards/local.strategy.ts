import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthUserService } from '../auth.user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'Local') {
  constructor(private readonly authService: AuthUserService) {
    super();
  }

  async validate(username: string, password: string) {
    const token = await this.authService.login({ username, password });
    return {
      token,
    };
  }
}
