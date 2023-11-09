import { DynamicModule, Provider } from '@nestjs/common';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { customRepository } from './custom-repository.decorator';

export class CustomTypeOrmModule {
  public static forCustomRepository<T extends new (...args: any[]) => any>(
    repositories: T[],
  ): DynamicModule {
    const providers: Provider[] = [];

    repositories.forEach((repo) => {
      const entity = Reflect.getMetadata(customRepository, repo);
      if (!entity) return;

      providers.push({
        inject: [getDataSourceToken()],
        provide: repo,
        useFactory: (dataSource: DataSource): typeof repo => {
          const baseRepository = dataSource.getRepository<any>(entity);
          return new repo(
            baseRepository.target,
            baseRepository.manager,
            baseRepository.queryRunner,
          );
        },
      });
    });

    return {
      exports: providers,
      module: CustomTypeOrmModule,
      providers,
    };
  }
}
