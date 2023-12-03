import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { GroupAchievementEntity } from './group-achievement.entity';
import { GroupAchievement } from '../domain/group-achievement.domain';

@CustomRepository(GroupAchievementEntity)
export class GroupAchievementRepository extends TransactionalRepository<GroupAchievementEntity> {
  async saveGroupAchievement(groupAchievement: GroupAchievement) {
    const newGroupAchievement = GroupAchievementEntity.from(groupAchievement);
    await this.repository.save(newGroupAchievement);
    return newGroupAchievement.toModel();
  }

  async findById(id: number) {
    const groupAchievementEntity = await this.repository
      .createQueryBuilder('group_achievement')
      .select()
      .leftJoin('group_achievement.group', 'group')
      .leftJoin('group_achievement.user', 'user')
      .addSelect('group.id')
      .addSelect('user.id')
      .addSelect('user.userCode')
      .where('group_achievement.id = :id', { id })
      .getOne();
    return groupAchievementEntity?.toModel();
  }
}
