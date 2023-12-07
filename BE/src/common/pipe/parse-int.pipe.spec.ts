import { ParseIntPipe } from './parse-int.pipe';
import { ArgumentMetadata } from '@nestjs/common';
import { MotimateException } from '../exception/motimate.excpetion';

describe('Custom ParseIntPipe test', () => {
  it('numeric 인자가 들어온 경우에는 int로 변경한다.', async () => {
    const target: ParseIntPipe = new ParseIntPipe();
    const metadata: ArgumentMetadata = {
      data: 'id',
      metatype: Number,
      type: 'param',
    };
    const parsedInt = target.transform('1', metadata);
    expect(parsedInt).toBe(1);
  });

  it('numeric 인자가 아닌 경우에는 MotimateException 던진다.', async () => {
    const target: ParseIntPipe = new ParseIntPipe();
    const metadata: ArgumentMetadata = {
      data: 'id',
      metatype: Number,
      type: 'param',
    };
    expect(() => target.transform('abc', metadata)).toThrow(
      new MotimateException({
        statusCode: 400,
        message: 'id must be int numeric string',
      }),
    );
  });

  it('소수가 들어오는 경우에는 MotimateException 던진다.', async () => {
    const target: ParseIntPipe = new ParseIntPipe();
    const metadata: ArgumentMetadata = {
      data: 'id',
      metatype: Number,
      type: 'param',
    };
    expect(() => target.transform('3.14', metadata)).toThrow(
      new MotimateException({
        statusCode: 400,
        message: 'id must be int numeric string',
      }),
    );
  });
});
