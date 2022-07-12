import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { get } from 'lodash';
import { AbilityRequest } from './interfaces';

export const USER_KEY = 'app_authenticated_user_request';

export const User = createParamDecorator(
  (param: string, ctx: ExecutionContext) => {
    const data =
      <AbilityRequest>Reflect.getOwnMetadata(USER_KEY, ctx.getClass()) || {};

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return param ? get(data, param) : data;
  }
);
