import { Ability, ForcedSubject, RawRule, RawRuleOf } from '@casl/ability';
import { actions, subjects } from './constant';

export type Abilities = [
  typeof actions[number],
  (
    | typeof subjects[number]
    | ForcedSubject<Exclude<typeof subjects[number], 'all'>>
  )
];

export type Actions = typeof actions[number];
export type Subjects = typeof subjects[number];

export type AppAbility = Ability<Abilities>;

export interface IRawRules extends RawRule {
  subject: typeof subjects[number];
  action: typeof actions[number];
  fields?: string[];
  conditions?: {
    [key: string]: string;
  };
  inverted?: boolean;
}

export type ApplicationRawRules = RawRuleOf<AppAbility>;
