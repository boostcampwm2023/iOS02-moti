import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { GroupAchievementEntity } from './group-achievement.entity';
import { GroupAchievement } from '../domain/group-achievement.domain';
import { IGroupAchievementDetail, IGroupAchievementListDetail } from '../index';
import { GroupAchievementDetailResponse } from '../dto/group-achievement-detail-response';
import { PaginateGroupAchievementRequest } from '../dto/paginate-group-achievement-request';
import { UserEntity } from '../../../users/entities/user.entity';
import { UserBlockedUserEntity } from '../../../users/entities/user-blocked-user.entity';
import { UserBlockedGroupAchievementEntity } from './user-blocked-group-achievement.entity';
import { GroupAchievementResponse } from '../dto/group-achievement-response';

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
    groupId: number,
    userId: number,
  ) {
    const groupAchievementEntitySelectQueryBuilder =
      await this.achievementDetailQuery(achievementId);
    const result = await groupAchievementEntitySelectQueryBuilder
      .andWhere(
        'groupAchievement.group_id in (select group_id from user_group where user_id = :userId and group_id = :groupId)',
        { userId, groupId },
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

  async findAll(
    userId: number,
    groupId: number,
    achievementPaginationOption: PaginateGroupAchievementRequest,
  ) {
    const blockedUserFilter = this.repository.manager
      .getRepository(UserBlockedUserEntity)
      .createQueryBuilder()
      .select('user_blocked_user.blocked_user_id')
      .from(UserBlockedUserEntity, 'user_blocked_user')
      .where(`user_blocked_user.user_id = ${userId}`)
      .getQuery();

    const blockedAchievementFilter = this.repository.manager
      .getRepository(UserBlockedGroupAchievementEntity)
      .createQueryBuilder()
      .select('user_blocked_achievement.group_achievement_id')
      .from(UserBlockedGroupAchievementEntity, 'user_blocked_achievement')
      .where(`user_blocked_achievement.user_id = ${userId}`)
      .getQuery();

    const query = this.repository
      .createQueryBuilder('group_achievement')
      .select([
        'group_achievement.id as id',
        'group_achievement.title as title',
      ])
      .innerJoin(
        (qp) => qp.select('*').from(UserEntity, 'u'),
        'user',
        'group_achievement.user_id = user.id',
      )
      .addSelect(['user.user_code as userCode'])

      .leftJoin('group_achievement.groupCategory', 'category')
      .addSelect('category.id as categoryId')

      .leftJoin('group_achievement.image', 'image')
      .addSelect('image.thumbnailUrl as thumbnailUrl')

      .where('group_achievement.group_id = :groupId', { groupId })
      .andWhere(`group_achievement.id NOT IN (${blockedAchievementFilter})`)
      .andWhere(`group_achievement.user_id NOT IN (${blockedUserFilter})`);

    const { whereIdLessThan, categoryId, take } = achievementPaginationOption;

    if (categoryId && categoryId !== 0 && categoryId !== -1) {
      query.andWhere('group_achievement.groupCategory.id = :categoryId', {
        categoryId,
      });
    }
    if (categoryId === -1) {
      query.andWhere('group_achievement.groupCategory.id IS NULL');
    }
    if (whereIdLessThan) {
      query.andWhere('group_achievement.id < :id', {
        id: whereIdLessThan,
      });
    }

    const result = await query
      .orderBy('group_achievement.created_at', 'DESC')
      .limit(take)
      .getRawMany<IGroupAchievementListDetail>();

    return result.map((groupAchievementListDetail) =>
      GroupAchievementResponse.from(groupAchievementListDetail),
    );
  }

  async findOneByIdAndGroupId(achievementId: number, groupId: number) {
    const findOne = await this.repository
      .createQueryBuilder('ga')
      .select('ga')
      .where('ga.id = :achievementId', { achievementId })
      .andWhere('ga.group_id = :groupId', { groupId })
      .getOne();
    return findOne?.toModel();
  }

  async findOneByIdAndUserAndGroup(
    achieveId: number,
    userId: number,
    groupId: number,
  ) {
    const findOne = await this.repository.findOne({
      where: { id: achieveId, group: { id: groupId }, user: { id: userId } },
      relations: {
        groupCategory: true,
      },
    });
    return findOne?.toModel();
  }
}
