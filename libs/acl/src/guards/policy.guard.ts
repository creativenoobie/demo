import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { USER_KEY } from './user.decorator';
import { CaslAbilityFactory } from '../casl';

@Injectable()
export class PoliciesGuard implements CanActivate {
  constructor(private caslAbilityFactory: CaslAbilityFactory) {}

  canActivate(context: ExecutionContext): boolean {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { user } = context.switchToHttp().getRequest();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const ability = this.caslAbilityFactory.createForUser(user);

    Reflect.defineMetadata(
      USER_KEY,
      {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        user,
        ability,
      },
      context.getClass()
    );

    return true;
  }
}
