import type { AuthenticatedRequest } from '@app/utils';
import { AppAbility } from '../casl';

interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;

export interface AbilityRequest extends AuthenticatedRequest {
  ability: AppAbility;
}
