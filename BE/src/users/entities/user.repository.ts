import { UserEntity } from './user.entity';
import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { User } from '../domain/user.domain';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';

@CustomRepository(UserEntity)
export class UserRepository extends TransactionalRepository<UserEntity> {
  async findOneByUserIdentifier(userIdentifier: string): Promise<User> {
    const userEntity = await this.repository.findOne({
      where: { userIdentifier: userIdentifier },
    });
    return userEntity?.toModel();
  }

  async findOneByUserCode(userCode: string): Promise<User> {
    const userEntity = await this.repository.findOneBy({
      userCode: userCode,
    });
    return userEntity?.toModel();
  }

  async saveUser(user: User): Promise<User> {
    const userEntity = UserEntity.from(user);
    const saved = await this.repository.save(userEntity);
    return saved.toModel();
  }

  async existByUserCode(userCode: string) {
    return await this.repository.exist({ where: { userCode: userCode } });
  }

  async findOneByUserIdentifierWithRoles(
    userIdentifier: string,
  ): Promise<User> {
    const userEntity = await this.repository.findOne({
      where: { userIdentifier: userIdentifier },
      relations: ['userRoles'],
    });
    return userEntity?.toModel();
  }

  async findOneByUserCodeWithRoles(userCode: string): Promise<User> {
    const userEntity = await this.repository.findOne({
      where: { userCode: userCode },
      relations: ['userRoles'],
    });
    return userEntity?.toModel();
  }
}
