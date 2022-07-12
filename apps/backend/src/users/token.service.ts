import Redis from 'ioredis';

import { nanoid } from 'nanoid/async';
import { Injectable } from '@nestjs/common';
import { InjectRedis } from '@liaoliaots/nestjs-redis';

@Injectable()
export class TokenService {
  constructor(
    @InjectRedis()
    private readonly redisClient: Redis
  ) {}

  generateToken(): Promise<string> {
    return nanoid();
  }

  async addData(payload: any) {
    const token = await this.generateToken();

    await this.redisClient.set(token, JSON.stringify(payload));

    return token;
  }

  async removeToken(token: string) {
    return this.redisClient.del(token);
  }

  async updateData(
    token: string,
    payload: any,
    { replace }: { replace: boolean } = { replace: false }
  ) {
    if (replace && typeof payload === 'object' && payload !== null) {
      const data = await this.redisClient.get(token);

      let result: string;
      if (Array.isArray(payload)) {
        const arr = <Array<any>>JSON.parse(data);
        arr.push(payload);
        result = JSON.stringify(arr);
      } else {
        const obj = <Object>JSON.parse(data);
        Object.assign(obj, payload);
        result = JSON.stringify(obj);
      }

      return this.redisClient.set(token, result);
    }

    return this.redisClient.set(token, JSON.stringify(payload));
  }

  async getData(token: string): Promise<any> {
    const data = await this.redisClient.get(token);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return JSON.parse(data);
  }
}
