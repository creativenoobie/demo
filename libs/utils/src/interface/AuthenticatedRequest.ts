import type { Request } from 'express';

import { IUserRequest } from './user';

export interface AuthenticatedRequest extends Request {
  user: IUserRequest;
}
