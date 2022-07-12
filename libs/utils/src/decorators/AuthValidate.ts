import { ObjectSchema } from 'joi';

import { applyDecorators, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { PoliciesGuard } from '@app/acl';

import { BearerGuard } from '../guards';
import { JoiValidationPipe } from '../pipes/joi';

export function AuthValidate(schema: ObjectSchema) {
  return applyDecorators(
    UseGuards(BearerGuard, PoliciesGuard),
    ApiBearerAuth(),
    UsePipes(new JoiValidationPipe(schema))
  );
}
