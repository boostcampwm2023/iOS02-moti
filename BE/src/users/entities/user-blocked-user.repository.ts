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

  async findByUserIdWithBlockedUser(userId: number) {
    const userBlockedUser = await this.repository
      .createQueryBuilder('userBlockedUser')
      .leftJoinAndSelect('userBlockedUser.blockedUser', 'blockedUser')
      .where('userBlockedUser.userId = :userId', { userId })
      .getMany();
    return userBlockedUser.map((ub) => ub.toModel());
  }

  async findByUserIdAndBlockedUserCode(userId: number, userCode: string) {
    const userBlockedUserEntity = await this.repository
      .createQueryBuilder('userBlockedUser')
      .leftJoinAndSelect('userBlockedUser.user', 'user')
      .leftJoinAndSelect('userBlockedUser.blockedUser', 'blockedUser')
      .where('user.id = :userId', { userId })
      .andWhere('blockedUser.userCode = :userCode', { userCode })
      .getOne();

    return userBlockedUserEntity?.toModel();
  }

  async deleteByUserIdAndBlockedUserId(userId: number, blockedUserId: number) {
    await this.repository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId AND blockedUserId = :blockedUserId', {
        userId: userId,
        blockedUserId: blockedUserId,
      })
      .execute();
  }
}
