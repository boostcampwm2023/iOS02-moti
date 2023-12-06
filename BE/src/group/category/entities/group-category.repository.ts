import { GroupCategoryEntity } from './group-category.entity';
import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { GroupCategory } from '../domain/group.category';
import { GroupCategoryMetadata } from '../dto/group-category-metadata';
import { User } from '../../../users/domain/user.domain';
import { ICategoryMetaData } from '../../../category';
import { CategoryMetaData } from '../../../category/dto/category-metadata';
import { Group } from '../../group/domain/group.domain';
import { GroupAchievementEntity } from '../../achievement/entities/group-achievement.entity';
import { Repository } from 'typeorm';

@CustomRepository(GroupCategoryEntity)
export class GroupCategoryRepository extends TransactionalRepository<GroupCategoryEntity> {
  async saveGroupCategory(groupCtg: GroupCategory): Promise<GroupCategory> {
    const groupCategoryEntity = GroupCategoryEntity.from(groupCtg);

    const saved = await this.repository.save(groupCategoryEntity);
    return saved.toModel();
  }

  async findByIdAndUser(userId: number, ctgId: number) {
    const groupCategoryEntity = await this.repository.findOneBy({
      user: { id: userId },
      id: ctgId,
    });
    return groupCategoryEntity?.toModel();
  }
  async findByIdAndGroup(groupId: number, ctgId: number) {
    const groupCategoryEntity = await this.repository.findOneBy({
      group: { id: groupId },
      id: ctgId,
    });
    return groupCategoryEntity?.toModel();
  }

  async findGroupCategoriesByUser(
    user: User,
    group: Group,
  ): Promise<GroupCategoryMetadata[]> {
    const categoryMetaData = await this.findAllByUserWithCount(user, group);
    if (categoryMetaData.length === 0) return categoryMetaData;

    const notSpecified = await this.findNotSpecifiedByUserAndId(group);
    return [notSpecified, ...categoryMetaData];
  }

  async findGroupCategory(group: Group, categoryId: number) {
    if (categoryId === -1) return this.findNotSpecifiedByUserAndId(group);
    return this.findByUserWithCount(group, categoryId);
  }

  async findAllByUserWithCount(
    user: User,
    group: Group,
  ): Promise<GroupCategoryMetadata[]> {
    const categories = await this.repository
      .createQueryBuilder('groupCategory')
      .select('groupCategory.id as categoryId')
      .addSelect('groupCategory.name', 'categoryName')
      .addSelect('MAX(achievement.created_at)', 'insertedAt')
      .addSelect('COUNT(achievement.id)', 'achievementCount')
      .leftJoin('groupCategory.achievements', 'achievement')
      .where('groupCategory.group_id = :groupId', { groupId: group.id })
      .andWhere(
        'groupCategory.group_id in (select group_id from user_group where user_id = :userId)',
        { userId: user.id },
      )
      .groupBy('groupCategory.id')
      .getRawMany<ICategoryMetaData>();

    return categories.map((category) => new CategoryMetaData(category));
  }

  async findByUserWithCount(
    group: Group,
    categoryId: number,
  ): Promise<GroupCategoryMetadata> {
    const category = await this.repository
      .createQueryBuilder('groupCategory')
      .select('groupCategory.id as categoryId')
      .addSelect('groupCategory.name', 'categoryName')
      .addSelect('MAX(achievement.created_at)', 'insertedAt')
      .addSelect('COUNT(achievement.id)', 'achievementCount')
      .leftJoin('groupCategory.achievements', 'achievement')
      .where('groupCategory.group_id = :groupId', { groupId: group.id })
      .andWhere('groupCategory.id = :categoryId', { categoryId })
      .groupBy('groupCategory.id')
      .getRawOne<ICategoryMetaData>();

    return category ? new CategoryMetaData(category) : null;
  }

  async findNotSpecifiedByUserAndId(
    group: Group,
  ): Promise<GroupCategoryMetadata> {
    const groupAchievementRepository: Repository<GroupAchievementEntity> =
      this.repository.manager.getRepository(GroupAchievementEntity);

    const category = await groupAchievementRepository
      .createQueryBuilder('groupAchievement')
      .select('-1 as categoryId')
      .addSelect(`'미설정' as categoryName`)
      .addSelect('MAX(groupAchievement.created_at)', 'insertedAt')
      .addSelect('COUNT(groupAchievement.id)', 'achievementCount')
      .where('groupAchievement.group_category_id is NULL')
      .andWhere('groupAchievement.group_id = :groupId', { groupId: group.id })
      .getRawOne<ICategoryMetaData>();

    return new CategoryMetaData(category);
  }
}
