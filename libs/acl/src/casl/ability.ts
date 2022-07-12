import { get } from 'lodash';

import { Ability } from '@casl/ability';
import { Injectable } from '@nestjs/common';

import type { IUserRequest } from '@app/utils';

import { Abilities, AppAbility, IRawRules } from './types';

import * as roles from '../../roles.json';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: IUserRequest): AppAbility {
    const permissions = this.interpolate(
      JSON.stringify(<Array<IRawRules>>roles),
      { user }
    );

    return new Ability<Abilities>(permissions);
  }

  private interpolate(template: string, vars: object) {
    return <Array<IRawRules>>JSON.parse(template, (_, rawValue: string) => {
      if (rawValue[0] !== '$') {
        return rawValue;
      }

      const name = rawValue.slice(2, -1);

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = get(vars, name);

      if (typeof value === 'undefined') {
        throw new ReferenceError(`Variable ${name} is not defined`);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return value;
    });
  }
}
