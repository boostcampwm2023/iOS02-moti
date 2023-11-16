import { applyDecorators, SetMetadata } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { QueryRunner } from 'typeorm';

export const TRANSACTIONAL_KEY = Symbol('TRANSACTIONAL');

export interface TransactionalMetadata {
  isTransactional: boolean;
  readonly: boolean;
}

export interface TransactionalOptions {
  readonly: boolean;
}

const defaultOptions: TransactionalOptions = {
  readonly: false,
};

export function Transactional(
  options: TransactionalOptions = defaultOptions,
): MethodDecorator {
  return applyDecorators(
    SetMetadata(TRANSACTIONAL_KEY, {
      isTransactional: true,
      readonly: options.readonly,
    }),
  );
}

export const queryRunnerLocalStorage = new AsyncLocalStorage<{
  queryRunner: QueryRunner;
}>();

export const retrieveQueryRunner = (): QueryRunner => {
  const queryRunner = queryRunnerLocalStorage.getStore();
  return queryRunner?.queryRunner;
};
