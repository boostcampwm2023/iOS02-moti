import { CustomRepository } from '../../../config/typeorm/custom-repository.decorator';
import { GroupAchievementEmojiEntity } from './group-achievement-emoji.entity';
import { TransactionalRepository } from '../../../config/transaction-manager/transactional-repository';
import { GroupAchievementEmoji } from '../domain/group-achievement-emoji.domain';
import { User } from '../../../users/domain/user.domain';
import { Emoji } from '../domain/emoji';
import { IGroupAchievementEmojiMetadata } from '../dto';
import { GroupAchievementEmojiListElement } from '../dto/group-achievement-emoji-list-element';
import { CompositeGroupAchievementEmoji } from '../dto/composite-group-achievement-emoji';

@CustomRepository(GroupAchievementEmojiEntity)
export class GroupAchievementEmojiRepository extends TransactionalRepository<GroupAchievementEmojiEntity> {
  async saveGroupAchievementEmoji(
    groupAchievementEmoji: GroupAchievementEmoji,
  ): Promise<GroupAchievementEmoji> {
    const groupAchievementEntity = GroupAchievementEmojiEntity.from(
      groupAchievementEmoji,
    );
    const groupAchievementEmojiEntity = await this.repository.save(
      groupAchievementEntity,
    );

    return groupAchievementEmojiEntity.toModel();
  }

  async deleteGroupAchievementEmoji(
    groupAchievementEmoji: GroupAchievementEmoji,
  ): Promise<void> {
    const groupAchievementEntity = GroupAchievementEmojiEntity.from(
      groupAchievementEmoji,
    );
    await this.repository.remove(groupAchievementEntity);
  }

  async getGroupAchievementEmojiByGroupAchievementIdAndUserAndEmoji(
    groupAchievementId: number,
    user: User,
    emoji: Emoji,
  ): Promise<GroupAchievementEmoji> {
    const findOne = await this.repository
      .createQueryBuilder('gae')
      .select('gae')
      .where('gae.group_achievement_id = :groupAchievementId', {
        groupAchievementId,
      })
      .andWhere('gae.emoji = :emoji', { emoji })
      .andWhere('gae.user_id = :userId', { userId: user.id })
      .getOne();

    return findOne?.toModel();
  }

  async findGroupAchievementEmojiMetaData(
    user: User,
    groupAchievementId: number,
    emoji: Emoji,
  ) {
    const metadata = await this.repository
      .createQueryBuilder('gae')
      .select(':emoji', 'id')
      .addSelect('COALESCE(COUNT(gae.id), 0)', 'count')
      .setParameters({
        emoji: emoji,
      })
      .addSelect(
        '(SELECT CASE WHEN EXISTS (SELECT 1 FROM group_achievement_emoji ' +
          ' WHERE user_id = :userId AND emoji = :emoji and group_achievement_id = :groupAchievementId) ' +
          'THEN 1 ELSE 0 END AS result)',
        'isSelected',
      )
      .setParameters({
        emoji: emoji,
        groupAchievementId: groupAchievementId,
        userId: user.id,
      })
      .where('gae.group_achievement_id = :groupAchievementId', {
        groupAchievementId,
      })
      .andWhere('gae.emoji = :emoji', { emoji: emoji })
      .groupBy('gae.groupAchievement')
      .getRawOne<IGroupAchievementEmojiMetadata>();

    return metadata
      ? GroupAchievementEmojiListElement.of(metadata)
      : GroupAchievementEmojiListElement.noEmoji(emoji);
  }

  async findAllGroupAchievementEmojiMetaData(
    user: User,
    groupAchievementId: number,
  ): Promise<CompositeGroupAchievementEmoji> {
    const metadata = await this.repository
      .createQueryBuilder('gae')
      .select('gae.emoji', 'id')
      .addSelect('COALESCE(COUNT(gae.id), 0)', 'count')
      .addSelect(
        '(SELECT CASE WHEN EXISTS (SELECT 1 FROM group_achievement_emoji ' +
          ' WHERE user_id = :userId AND emoji = gae.emoji and group_achievement_id = :groupAchievementId) ' +
          'THEN 1 ELSE 0 END AS result)',
        'isSelected',
      )
      .setParameters({
        groupAchievementId: groupAchievementId,
        userId: user.id,
      })
      .where('gae.group_achievement_id = :groupAchievementId', {
        groupAchievementId,
      })
      .groupBy('gae.groupAchievement')
      .addGroupBy('gae.emoji')
      .getRawMany<IGroupAchievementEmojiMetadata>();

    const groupAchievementEmojiListElements = metadata.map((m) =>
      GroupAchievementEmojiListElement.of(m),
    );
    return CompositeGroupAchievementEmoji.of(groupAchievementEmojiListElements);
  }
}
