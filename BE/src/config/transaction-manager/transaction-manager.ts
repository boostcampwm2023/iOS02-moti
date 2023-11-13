import { Injectable, OnModuleInit } from '@nestjs/common';
import { DiscoveryService, MetadataScanner, Reflector } from '@nestjs/core';
import { DataSource, Repository } from 'typeorm';
import { queryRunnerLocalStorage, TRANSACTIONAL_KEY } from './index';

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
    this.repositoryWrap();
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

        const isTransactional = this.reflector.get(
          TRANSACTIONAL_KEY,
          originalMethod,
        );

        if (!isTransactional) {
          continue;
        }

        instance.instance[name] = this.wrapMethod(
          originalMethod,
          instance.instance,
        );
      }
    }
  }

  repositoryWrap() {
    this.discover
      .getProviders()
      .filter((v) => v.isDependencyTreeStatic())
      .filter(({ metatype, instance }) => {
        if (!instance || !metatype) return false;
        else return true;
      })
      .filter(({ instance }) => instance instanceof Repository)
      .forEach(({ instance }) => {
        Object.defineProperty(instance, 'manager', {
          configurable: false,
          get() {
            const store = queryRunnerLocalStorage.getStore();
            return store?.queryRunner.manager;
          },
        });
      });
  }

  wrapMethod(originalMethod: any, instance: any) {
    const { dataSource } = this;

    return async function (...args: any[]) {
      const store = queryRunnerLocalStorage.getStore();

      if (store !== undefined)
        return await originalMethod.apply(instance, args);

      const queryRunner = dataSource.createQueryRunner();
      await queryRunner.startTransaction();

      const result = await queryRunnerLocalStorage.run(
        { queryRunner },
        async () => {
          try {
            const result = await originalMethod.apply(instance, args);
            await queryRunner.commitTransaction();

            return result;
          } catch (error) {
            await queryRunner.rollbackTransaction();
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
