import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { GroupAchievementEntity } from './group-achievement.entity';
import { GroupAchievement } from '../domain/group-achievement.domain';
import { IGroupAchievementDetail } from '../index';
import { GroupAchievementDetailResponse } from '../dto/group-achievement-detail-response';

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

  async findAchievementDetailByIdAndBelongingGroup(
    achievementId: number,
    userId: number,
  ) {
    const groupAchievementEntitySelectQueryBuilder =
      await this.achievementDetailQuery(achievementId);
    const result = await groupAchievementEntitySelectQueryBuilder
      .andWhere(
        'groupAchievement.group_id in (select group_id from user_group where user_id = :userId)',
        { userId },
      )
      .getRawOne<IGroupAchievementDetail>();

    if (result.id) return new GroupAchievementDetailResponse(result);
    return null;
  }

  async findAchievementDetailByIdAndUser(
    userId: number,
    achievementId: number,
  ) {
    const groupAchievementEntitySelectQueryBuilder =
      await this.achievementDetailQuery(achievementId);
    const result = await groupAchievementEntitySelectQueryBuilder
      .andWhere('groupAchievement.user_id = :userId', { userId })
      .getRawOne<IGroupAchievementDetail>();

    if (result.id) return new GroupAchievementDetailResponse(result);
    return null;
  }

  async saveAchievement(achievement: GroupAchievement) {
    const achievementEntity = GroupAchievementEntity.from(achievement);
    const saved = await this.repository.save(achievementEntity);
    return saved.toModel();
  }

  private async achievementDetailQuery(achievementId: number) {
    return this.repository
      .createQueryBuilder('groupAchievement')
      .leftJoinAndSelect('groupAchievement.groupCategory', 'gc')
      .select('groupAchievement.id', 'id')
      .addSelect('groupAchievement.title', 'title')
      .addSelect('groupAchievement.content', 'content')
      .addSelect('i.imageUrl', 'imageUrl')
      .addSelect('groupAchievement.createdAt', 'createdAt')
      .addSelect('gc.id', 'categoryId')
      .addSelect('gc.name', 'categoryName')
      .addSelect('COUNT(ga.id)', 'achieveCount')
      .addSelect('user.userCode', 'userCode')
      .leftJoin(
        'group_achievement',
        'ga',
        'COALESCE(ga.group_category_id, -1) = COALESCE(groupAchievement.group_category_id, -1) AND ga.id <= groupAchievement.id',
      )
      .leftJoin('image', 'i', 'i.group_achievement_id = groupAchievement.id')
      .leftJoin('groupAchievement.user', 'user')
      .where('groupAchievement.id = :achievementId', { achievementId });
  }
}
