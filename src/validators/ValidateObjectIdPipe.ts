// Create a custom pipe for ObjectId validation
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';

@Injectable()
export class ValidateObjectIdPipe implements PipeTransform {
  transform(value: any) {
    if (!isValidObjectId(value)) {
      throw new BadRequestException('Invalid ID');
    }
    return value;
  }
}