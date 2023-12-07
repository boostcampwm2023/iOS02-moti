import { CustomRepository } from '../../config/typeorm/custom-repository.decorator';
import { TransactionalRepository } from '../../config/transaction-manager/transactional-repository';
import { UserBlockedUserEntity } from './user-blocked-user.entity';
import { UserBlockedUser } from '../domain/user-blocked-user.domain';

@CustomRepository(UserBlockedUserEntity)
export class UserBlockedUserRepository extends TransactionalRepository<UserBlockedUserEntity> {
  async saveUserBlockedUser(
    userBlockedUser: UserBlockedUser,
  ): Promise<UserBlockedUser> {
    const userBlockedUserEntity = UserBlockedUserEntity.from(userBlockedUser);
    const saved = await this.repository.save(userBlockedUserEntity);
    return saved.toModel();
  }
}
