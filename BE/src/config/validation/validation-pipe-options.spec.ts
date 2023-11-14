import { ValidationError } from '@nestjs/common';
import { validationPipeOptions } from './index';
import { MotimateException } from '../../common/exception/motimate.excpetion';

describe('ValidationPipeOption test', () => {
  it('exceptionFactory는 errors가 null일 때도 예외를 발생시키지 않는다', () => {
    // given
    const emptyErrors: ValidationError[] = null;

    // when
    const exception = validationPipeOptions.exceptionFactory(emptyErrors);

    // then
    expect(exception).toBeDefined();
    expect(exception).toBeInstanceOf(MotimateException);
    expect(exception.status).toBe(400);
    expect(exception.getResponse()).toStrictEqual({
      error: '잘못된 입력입니다.',
    });
  });

  it('exceptionFactory는 errors가 undefined일 때도 예외를 발생시키지 않는다', () => {
    // given
    const emptyErrors: ValidationError[] = undefined;

    // when
    const exception = validationPipeOptions.exceptionFactory(emptyErrors);

    // then
    expect(exception).toBeDefined();
    expect(exception).toBeInstanceOf(MotimateException);
    expect(exception.status).toBe(400);
    expect(exception.getResponse()).toStrictEqual({
      error: '잘못된 입력입니다.',
    });
  });

  it('ValidationError의 적절한 constraints가 없어도 동작이 멈추지 않는다.', () => {
    //given
    const validationErrors: ValidationError[] = [
      { property: 'test1' },
      { property: 'test2' },
    ];

    // when
    const exception = validationPipeOptions.exceptionFactory(validationErrors);

    // then
    expect(exception).toBeDefined();
    expect(exception).toBeInstanceOf(MotimateException);
    expect(exception.status).toBe(400);
    expect(exception.getResponse()).toStrictEqual({
      test1: undefined,
      test2: undefined,
    });
  });

  it('errors의 동일한 키의 property가 없을 땐 에러 메시지가 단일 메시지 형태로 전달된다.', () => {
    //given
    const validationErrors: ValidationError[] = [
      { property: 'test1', constraints: { test: 'test-error1' } },
      { property: 'test2', constraints: { test: 'test-error2' } },
    ];

    // when
    const exception = validationPipeOptions.exceptionFactory(validationErrors);

    // then
    expect(exception).toBeDefined();
    expect(exception).toBeInstanceOf(MotimateException);
    expect(exception.status).toBe(400);
    expect(exception.getResponse()).toStrictEqual({
      test1: 'test-error1',
      test2: 'test-error2',
    });
  });

  it('errors의 동일 키의 property가 있을 땐 배열의 형태로 묶인다.', () => {
    //given
    const validationErrors: ValidationError[] = [
      {
        property: 'test1',
        constraints: { error1: 'test1-error1', error2: 'test1-error2' },
      },
      { property: 'test2', constraints: { error1: 'test2-error1' } },
    ];

    // when
    const exception = validationPipeOptions.exceptionFactory(validationErrors);

    // then
    expect(exception).toBeDefined();
    expect(exception).toBeInstanceOf(MotimateException);
    expect(exception.status).toBe(400);
    expect(exception.getResponse()).toStrictEqual({
      test1: ['test1-error1', 'test1-error2'],
      test2: 'test2-error1',
    });
  });
});
