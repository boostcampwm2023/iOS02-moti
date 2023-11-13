import { applyDecorators, SetMetadata } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { QueryRunner } from 'typeorm';

export const TRANSACTIONAL_KEY = Symbol('TRANSACTIONAL');

export function Transactional(): MethodDecorator {
  return applyDecorators(SetMetadata(TRANSACTIONAL_KEY, true));
}

export const queryRunnerLocalStorage = new AsyncLocalStorage<{
  queryRunner: QueryRunner;
}>();

export const retrieveQueryRunner = (): QueryRunner => {
  const queryRunner = queryRunnerLocalStorage.getStore();
  return queryRunner?.queryRunner;
};
