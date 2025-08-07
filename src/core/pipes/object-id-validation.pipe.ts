import { isValidObjectId } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export class ObjectIdValidationPipe {
  transform(value: string) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException();
    }
    return value;
  }
}
