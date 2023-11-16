import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import {
  queryRunnerLocalStorage,
  TRANSACTIONAL_KEY,
  TransactionalMetadata,
} from './index';

@Injectable()
export class TransactionManager implements OnModuleInit {
  constructor(
    private readonly discover: DiscoveryService,
    private readonly metadataScanner: MetadataScanner,
    private readonly reflector: Reflector,
    private readonly dataSource: DataSource,
  ) {}

  onModuleInit(): any {
    this.transactionalWrap();
  }

  transactionalWrap() {
    const instances = this.discover
      .getProviders()
      .filter((v) => v.isDependencyTreeStatic())
      .filter(({ metatype, instance }) => {
        if (!instance || !metatype) return false;
        else return true;
      });

    for (const instance of instances) {
      const names = this.metadataScanner.getAllMethodNames(
        Object.getPrototypeOf(instance.instance),
      );

      for (const name of names) {
        const originalMethod = instance.instance[name];

        const transactionOptions: TransactionalMetadata =
          this.reflector.get<TransactionalMetadata>(
            TRANSACTIONAL_KEY,
            originalMethod,
          );

        if (!transactionOptions?.isTransactional) {
          continue;
        }

        instance.instance[name] = this.wrapMethod(
          transactionOptions.readonly,
          originalMethod,
          instance.instance,
        );
      }
    }
  }

  wrapMethod(readOnly: boolean, originalMethod: any, instance: any) {
    const { dataSource } = this;

    return async function (...args: any[]) {
      const store = queryRunnerLocalStorage.getStore();

      if (store !== undefined)
        return await originalMethod.apply(instance, args);

      const queryRunner = dataSource.createQueryRunner();
      if (!readOnly) await queryRunner.startTransaction();

      const result = await queryRunnerLocalStorage.run(
        { queryRunner },
        async () => {
          try {
            const result = await originalMethod.apply(instance, args);
            if (!readOnly) await queryRunner.commitTransaction();

            return result;
          } catch (error) {
            if (!readOnly) await queryRunner.rollbackTransaction();
            throw error;
          } finally {
            await queryRunner.release();
          }
        },
      );

      return result;
    };
  }
}
