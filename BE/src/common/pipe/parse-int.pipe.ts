import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { MotimateException } from '../exception/motimate.excpetion';

@Injectable()
export class ParseIntPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (isNaN(value) || !this.isIntNumeric(value)) {
      throw new MotimateException({
        statusCode: 400,
        message: `${metadata.data} must be int numeric string`,
      });
    }
    return parseInt(value);
  }
  private isIntNumeric(str: string) {
    return /^-?\d+$/.test(str);
  }
}
