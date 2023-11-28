import { DeepPartial, Repository, SaveOptions } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { retrieveQueryRunner } from './index';

export class TransactionalRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  get repository(): Repository<Entity> {
    return retrieveQueryRunner()?.manager.getRepository(this.target) || this;
  }

  save<T extends DeepPartial<Entity>>(
    entity: T,
    options?: SaveOptions,
  ): Promise<T & Entity> {
    Object.keys(entity).forEach((key) => {
      entity[key] = entity[key] ?? undefined;
    });

    return super.save(entity, options);
  }
}
