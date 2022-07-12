import { ObjectSchema } from 'joi';

import { applyDecorators, UseGuards, UsePipes } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { BearerGuard } from '../guards';
import { JoiValidationPipe } from '../pipes/joi';

export function AuthValidate(schema: ObjectSchema) {
  return applyDecorators(
    UseGuards(BearerGuard),
    ApiBearerAuth(),
    UsePipes(new JoiValidationPipe(schema))
  );
}
