import { Injectable, PipeTransform } from '@nestjs/common';
import { MotimateException } from '../exception/motimate.excpetion';

@Injectable()
export class ParseNotEmptyPipe implements PipeTransform {
  transform(value: any) {
    if (!value)
      throw new MotimateException({
        statusCode: 400,
        message: '값을 입력해주세요.',
      });

    return value;
  }
}
