import Redis from 'ioredis';
import { Strategy } from 'passport-http-bearer';

import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

import { IUserRequest } from '../interface/user';

@Injectable()
export class BearerStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRedis()
    private readonly redisClient: Redis
  ) {
    super();
  }

  async validate(token: string): Promise<IUserRequest> {
    const t = token.replace(/bearer/i, '').trim();

    const data = await this.redisClient.get(t);

    if (!data) throw new UnauthorizedException('Please re-login');

    const id = <number>JSON.parse(data);

    return {
      id,
      token: t,
    };
  }
}
