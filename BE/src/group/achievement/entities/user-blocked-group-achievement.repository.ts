import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { UserBlockedGroupAchievementEntity } from './user-blocked-group-achievement.entity';
import { UserBlockedGroupAchievement } from '../domain/user-blocked-group-achievement.domain';

@CustomRepository(UserBlockedGroupAchievementEntity)
export class UserBlockedGroupAchievementRepository extends TransactionalRepository<UserBlockedGroupAchievementEntity> {
  async saveUserBlockedGroupAchievement(
    userBlockedGroupAchievement: UserBlockedGroupAchievement,
  ) {
    const newUserBlockedGroupAchievement =
      UserBlockedGroupAchievementEntity.from(userBlockedGroupAchievement);
    await this.repository.save(newUserBlockedGroupAchievement);
    return newUserBlockedGroupAchievement.toModel();
  }
}
