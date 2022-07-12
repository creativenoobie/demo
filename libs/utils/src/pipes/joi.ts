import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(inputs: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'custom') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return inputs;
    }

    const rules = this.schema.extract(metadata.type);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error, value } = rules.validate(inputs);

    if (error) {
      throw new BadRequestException(error);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return value;
  }
}
