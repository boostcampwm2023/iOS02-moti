import { Injectable, PipeTransform } from '@nestjs/common';
import { MotimateException } from '../exception/motimate.excpetion';

@Injectable()
export class ParseFilePipe implements PipeTransform {
  transform(value: any) {
    if (!value)
      throw new MotimateException({
        statusCode: 400,
        message: '파일을 선택해주세요.',
      });
    return value;
  }
}
