import { Repository } from 'typeorm';
import { ObjectLiteral } from 'typeorm/common/ObjectLiteral';
import { retrieveQueryRunner } from './index';

export class TransactionalRepository<
  Entity extends ObjectLiteral,
> extends Repository<Entity> {
  get repository(): Repository<Entity> {
    return retrieveQueryRunner()?.manager.getRepository(this.target) || this;
  }
}
