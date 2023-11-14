import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { retrieveQueryRunner } from '../../config/transaction-manager';
import { User } from '../domain/user.domain';

@CustomRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findOneByUserIdentifier(userIdentifier: string): Promise<User> {
    const repository = this.getRepository();
    const userEntity = await repository.findOneBy({
      userIdentifier: userIdentifier,
    });
    return userEntity?.toModel();
  }

  async findOneByUserCode(userCode: string): Promise<User> {
    const repository = this.getRepository();
    const userEntity = await repository.findOneBy({
      userCode: userCode,
    });
    return userEntity?.toModel();
  }

  async saveUser(user: User): Promise<User> {
    const repository = this.getRepository();
    const userEntity = UserEntity.from(user);
    const saved = await repository.save(userEntity);
    return saved.toModel();
  }
  async existByUserCode(userCode: string) {
    const repository = this.getRepository();
    return await repository.exist({ where: { userCode: userCode } });
  }

  private getRepository(): Repository<UserEntity> {
    return retrieveQueryRunner()?.manager.getRepository(UserEntity) || this;
  }
}
